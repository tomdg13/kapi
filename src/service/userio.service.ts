import { CreateUserioDto, UpdateUserioDto, UserioDto } from 'src/dto/userio.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class userioService {
  constructor(private dataSource: DataSource) {}

  async findUserioById(dto: UserioDto): Promise<any> {
    try {
      const query = `SELECT * FROM io_user WHERE user_id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `User with ID ${dto.id} not found`,
          data: [],
        };
      }

      // Remove password from response
      const userWithoutPassword = result.map(user => {
        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
      });

      return {
        status: 'success',
        message: 'User fetched successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        status: 'error',
        message: 'Failed to fetch user info',
        error: error.message,
      };
    }
  }

  async findUseriosByRole(dto: UserioDto): Promise<any> {
    try {
      let query: string;
      let params: any[] = [];

      if (dto.role?.toLowerCase() === 'admin') {
        // Admin: show all users (exclude password)
        query = `SELECT user_id, name, username, email, phone, document_id, photo, photo_id, 
                        village_id, district_id, province_id, branch_id, company_id, status, role, 
                        account_bank_id, account_no, account_name, language, bio, online 
                 FROM io_user`;
      } else {
        // Non-admin: filter by role (exclude password)
        query = `SELECT user_id, name, username, email, phone, document_id, photo, photo_id, 
                        village_id, district_id, province_id, branch_id, company_id, status, role, 
                        account_bank_id, account_no, account_name, language, bio, online 
                 FROM io_user WHERE role = ?`;
        params.push(dto.role);
      }

      const result = await this.dataSource.query(query, params);

      // Base URL where photos are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/user/`;

      // Append full photo URLs
      const usersWithPhotos = result.map((user: any) => ({
        ...user,
        photo: user.photo ? imageBaseUrl + user.photo : null,
        photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
      }));

      return {
        status: 'success',
        message: dto.role?.toLowerCase() === 'admin' ? 'All users fetched' : `Users with role ${dto.role} fetched`,
        data: usersWithPhotos,
      };
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return {
        status: 'error',
        message: 'Failed to fetch users',
        error: error.message,
      };
    }
  }

  async addUserioWithPhoto(userioDto: CreateUserioDto): Promise<{ status: string; message: string; data?: any }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        name,
        username,
        email,
        password,
        phone,
        document_id,
        photo,
        photo_id,
        village_id,
        district_id,
        province_id,
        branch_id,      // Added missing field
        company_id,     // Added missing field
        status = 'active',
        role = 'user',
        account_bank_id,
        account_no,
        account_name,
        language = 'en',
        bio,
        online = 'false', // Changed to string
      } = userioDto;

      // Check if user already exists
      const existingUser = await queryRunner.query(
        `SELECT user_id FROM io_user WHERE email = ? OR phone = ? OR username = ?`,
        [email, phone, username]
      );

      if (existingUser.length > 0) {
        throw new HttpException(
          'User with this email, phone, or username already exists',
          HttpStatus.CONFLICT
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Save images
      let photoFilename: string | null = null;
      let photoIdFilename: string | null = null;

      try {
        if (photo) {
          photoFilename = await this.saveImage(photo);
        }
        if (photo_id) {
          photoIdFilename = await this.saveImage(photo_id);
        }
      } catch (imageError) {
        // Clean up any saved images on error
        if (photoFilename) await this.deleteImage(photoFilename);
        if (photoIdFilename) await this.deleteImage(photoIdFilename);
        throw new Error(`Image processing failed: ${imageError.message}`);
      }

      // Insert user with parameterized query - updated to match your database structure
      const sql = `
        INSERT INTO io_user (
          user_id, name, username, email, password, phone, document_id,
          photo, photo_id, village_id, district_id, province_id, 
          branch_id, company_id, status, role, account_bank_id, 
          account_no, account_name, language, bio, online
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        null, // user_id (auto-increment)
        name,
        username,
        email,
        hashedPassword,
        phone,
        document_id,
        photoFilename,
        photoIdFilename,
        village_id,
        district_id,
        province_id,
        branch_id,       // Added
        company_id,      // Added
        status,
        role,
        account_bank_id,
        account_no,
        account_name,
        language,
        bio,
        online,
      ];

      const result = await queryRunner.query(sql, params);
      await queryRunner.commitTransaction();

      console.log('✅ User created successfully with ID:', result.insertId);

      return {
        status: 'success',
        message: 'User created successfully',
        data: {
          user_id: result.insertId,
          email,
          phone,
          username,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error creating user:', error.message);
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserioWithPhoto(
    phone: string,
    userioDto: UpdateUserioDto,
  ): Promise<{ status: string; message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('📝 Received userioDto:', JSON.stringify(userioDto, null, 2));

      const {
        name,
        username,
        email,
        phone: newPhone,
        document_id,
        photo,
        photo_id,
        village_id,
        district_id,
        province_id,
        branch_id,      // Added
        company_id,     // Added
        status,
        role,
        account_bank_id,
        account_no,
        account_name,
        language,
        online,
        bio,
        password, // New password if provided
      } = userioDto;

      // Find existing user
      const [existingUser] = await queryRunner.query(
        `SELECT user_id, photo, photo_id, email, username FROM io_user WHERE phone = ?`,
        [phone],
      );

      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check for email conflicts if email is being updated
      if (email && email !== existingUser.email) {
        const emailConflict = await queryRunner.query(
          `SELECT user_id FROM io_user WHERE email = ? AND phone != ?`,
          [email, phone]
        );
        if (emailConflict.length > 0) {
          throw new HttpException('Email already in use', HttpStatus.CONFLICT);
        }
      }

      // Check for username conflicts if username is being updated
      if (username && username !== existingUser.username) {
        const usernameConflict = await queryRunner.query(
          `SELECT user_id FROM io_user WHERE username = ? AND phone != ?`,
          [username, phone]
        );
        if (usernameConflict.length > 0) {
          throw new HttpException('Username already in use', HttpStatus.CONFLICT);
        }
      }

      // Handle photos: use new photo if provided, else keep existing one
      let photoFilename = existingUser.photo;
      let photoIdFilename = existingUser.photo_id;
      let oldPhotoFilename = null;
      let oldPhotoIdFilename = null;

      try {
        if (photo) {
          oldPhotoFilename = existingUser.photo;
          photoFilename = await this.saveImage(photo);
        }
        if (photo_id) {
          oldPhotoIdFilename = existingUser.photo_id;
          photoIdFilename = await this.saveImage(photo_id);
        }
      } catch (imageError) {
        throw new Error(`Image processing failed: ${imageError.message}`);
      }

      // Prepare fields to update dynamically
      const updates: string[] = [];
      const values: any[] = [];

      // Helper to add field only if value is not null or undefined
      function addField(fieldName: string, value: any) {
        if (value !== null && value !== undefined) {
          updates.push(`${fieldName} = ?`);
          values.push(value);
        }
      }

      addField('name', name);
      addField('username', username);
      addField('email', email);
      addField('phone', newPhone);
      addField('document_id', document_id);
      addField('photo', photoFilename);
      addField('photo_id', photoIdFilename);
      addField('village_id', village_id);
      addField('district_id', district_id);
      addField('province_id', province_id);
      addField('branch_id', branch_id);        // Added
      addField('company_id', company_id);      // Added
      addField('status', status);
      addField('role', role);
      addField('account_bank_id', account_bank_id);
      addField('account_no', account_no);
      addField('account_name', account_name);
      addField('bio', bio);
      addField('online', online);
      addField('language', language);

      // Handle password update if provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        addField('password', hashedPassword);
      }

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add WHERE condition value
      values.push(phone);

      const sql = `
        UPDATE io_user SET
          ${updates.join(', ')}
        WHERE phone = ?
      `;

      console.log('🧾 Executing SQL:\n', sql);
      console.log('📦 With values:', values.map(v => typeof v === 'string' && v.length > 50 ? `${v.substring(0, 50)}...` : v));

      await queryRunner.query(sql, values);
      await queryRunner.commitTransaction();

      // Clean up old images after successful update
      if (oldPhotoFilename && oldPhotoFilename !== photoFilename) {
        await this.deleteImage(oldPhotoFilename);
      }
      if (oldPhotoIdFilename && oldPhotoIdFilename !== photoIdFilename) {
        await this.deleteImage(oldPhotoIdFilename);
      }

      console.log('✅ User update complete for phone:', phone);
      return {
        status: 'success',
        message: 'User updated successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error updating user:', error.message);
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'user');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      
      // Validate file size (max 5MB)
      const sizeInBytes = (data.length * 3) / 4;
      if (sizeInBytes > 5 * 1024 * 1024) {
        throw new Error('Image size exceeds 5MB limit');
      }

      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await fs.writeFile(filePath, data, 'base64');
      console.log('📸 Image saved:', uniqueName);
      return uniqueName;
    } catch (error) {
      console.error('❌ Failed to save image:', error.message);
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  private async deleteImage(filename: string): Promise<void> {
    if (!filename) return;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'user');
      const filePath = path.join(uploadPath, filename);
      
      // Check if file exists before deleting
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log('🗑️ Deleted old image:', filename);
      } catch (err) {
        // File doesn't exist, which is fine
        console.log('📁 Image file not found for deletion:', filename);
      }
    } catch (error) {
      console.error('❌ Error deleting image:', error.message);
      // Don't throw error for cleanup operations
    }
  }

  private parseBase64Image(base64Str: string): { mimeType: string; data: string } {
    const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
    }

    const mimeType = matches[1];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(mimeType)) {
      throw new Error(`Unsupported image type: ${mimeType}`);
    }

    return {
      mimeType: matches[1],
      data: matches[2],
    };
  }

  private getFileExtension(mimeType: string): string {
    const map: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    return map[mimeType] || 'png';
  }

  async deleteUserio(phone: string): Promise<{ status: string; message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get user data before deletion for cleanup
      const [existingUser] = await queryRunner.query(
        `SELECT photo, photo_id FROM io_user WHERE phone = ?`,
        [phone]
      );

      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Delete user record
      await queryRunner.query(`DELETE FROM io_user WHERE phone = ?`, [phone]);
      await queryRunner.commitTransaction();

      // Clean up images after successful deletion
      if (existingUser.photo) {
        await this.deleteImage(existingUser.photo);
      }
      if (existingUser.photo_id) {
        await this.deleteImage(existingUser.photo_id);
      }

      return {
        status: 'success',
        message: 'User deleted successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error deleting user:', error.message);
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}