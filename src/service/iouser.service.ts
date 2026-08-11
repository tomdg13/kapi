import { CreateIouserDto, IouserDto } from 'src/dto/iouser.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class iouserService {
  constructor(private dataSource: DataSource) { }

  async findIouserById(dto: IouserDto): Promise<any> {
    try {
      // JOIN with io_role to get role details
      const query = `
        SELECT 
          u.*,
          r.role_id,
          r.role_name,
          r.role_code,
          r.description as role_description,
          r.level as role_level,
          r.permissions as role_permissions
        FROM io_user u
        LEFT JOIN io_role r ON u.role_id = r.role_id
        WHERE u.user_id = ?
      `;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `User with ID ${dto.id} not found`,
          data: [],
        };
      }

      // Add photo URLs
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
      const userWithPhotos = {
        ...result[0],
        photo: result[0].photo ? imageBaseUrl + result[0].photo : null,
        photo_id: result[0].photo_id ? imageBaseUrl + result[0].photo_id : null,
      };

      return {
        status: 'success',
        message: 'User fetched successfully',
        data: [userWithPhotos],
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

  async findIousersByCompany(company_id: number): Promise<any> {
    try {
      // JOIN with io_role
      const query = `
        SELECT 
          u.*,
          r.role_id,
          r.role_name,
          r.role_code,
          r.level as role_level
        FROM io_user u
        LEFT JOIN io_role r ON u.role_id = r.role_id
        WHERE u.company_id = ? 
        ORDER BY u.name ASC
      `;
      const result = await this.dataSource.query(query, [company_id]);

      // Base URL where photos are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

      // Append full photo URLs
      const usersWithPhotos = result.map((user: any) => ({
        ...user,
        photo: user.photo ? imageBaseUrl + user.photo : null,
        photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
      }));

      return {
        status: 'success',
        message: `Found ${result.length} users for company ${company_id}`,
        data: usersWithPhotos,
      };
    } catch (error) {
      console.error('Error fetching users by company:', error);
      return {
        status: 'error',
        message: 'Failed to fetch users by company',
        error: error.message,
      };
    }
  }

  async searchUsers(searchParams: {
    company_id?: number;
    role_id?: number;  // CHANGED: from role to role_id
    role_code?: string; // NEW: search by role_code
    status?: string;
    search_text?: string;
  }): Promise<any> {
    try {
      let query = `
        SELECT 
          u.*,
          r.role_id,
          r.role_name,
          r.role_code,
          r.level as role_level
        FROM io_user u
        LEFT JOIN io_role r ON u.role_id = r.role_id
        WHERE 1=1
      `;
      const params: any[] = [];

      // Filter by company_id
      if (searchParams.company_id) {
        query += ` AND u.company_id = ?`;
        params.push(searchParams.company_id);
      }

      // Filter by role_id
      if (searchParams.role_id) {
        query += ` AND u.role_id = ?`;
        params.push(searchParams.role_id);
      }

      // Filter by role_code
      if (searchParams.role_code) {
        query += ` AND r.role_code = ?`;
        params.push(searchParams.role_code);
      }

      // Filter by status
      if (searchParams.status) {
        query += ` AND u.status = ?`;
        params.push(searchParams.status);
      }

      // Search by name, email, or phone
      if (searchParams.search_text) {
        query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
        const searchTerm = `%${searchParams.search_text}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ` ORDER BY u.name ASC`;

      const result = await this.dataSource.query(query, params);

      // Base URL where photos are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

      // Append full photo URLs
      const usersWithPhotos = result.map((user: any) => ({
        ...user,
        photo: user.photo ? imageBaseUrl + user.photo : null,
        photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
      }));

      return {
        status: 'success',
        message: `Found ${result.length} users matching search criteria`,
        data: usersWithPhotos,
        total: result.length,
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        status: 'error',
        message: 'Failed to search users',
        error: error.message,
      };
    }
  }

  async findIousersByRole(dto: IouserDto): Promise<any> {
    try {
      let query: string;
      let params: any[] = [];

      // UPDATED: Check role by role_code or level
      if (dto.role?.toLowerCase() === 'admin' || dto.role_code?.toLowerCase() === 'admin') {
        // Admin: show all users with role details
        query = `
          SELECT 
            u.*,
            r.role_id,
            r.role_name,
            r.role_code,
            r.level as role_level
          FROM io_user u
          LEFT JOIN io_role r ON u.role_id = r.role_id
          WHERE 1=1
        `;
        if (dto.company_id) {
          query += ` AND u.company_id = ?`;
          params.push(dto.company_id);
        }
      } else {
        // Non-admin: filter by role_id or role_code
        query = `
          SELECT 
            u.*,
            r.role_id,
            r.role_name,
            r.role_code,
            r.level as role_level
          FROM io_user u
          LEFT JOIN io_role r ON u.role_id = r.role_id
          WHERE 1=1
        `;
        
        // Filter by role_id if provided
        if (dto.role_id) {
          query += ` AND u.role_id = ?`;
          params.push(dto.role_id);
        }
        
        // OR filter by role_code
        if (dto.role_code) {
          query += ` AND r.role_code = ?`;
          params.push(dto.role_code);
        }

        // Filter by company if provided
        if (dto.company_id) {
          query += ` AND u.company_id = ?`;
          params.push(dto.company_id);
        }
      }

      query += ` ORDER BY u.name ASC`;

      const result = await this.dataSource.query(query, params);

      // Base URL where photos are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

      // Append full photo URLs
      const usersWithPhotos = result.map((user: any) => ({
        ...user,
        photo: user.photo ? imageBaseUrl + user.photo : null,
        photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
      }));

      return {
        status: 'success',
        message: `Users fetched successfully`,
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

  // NEW METHOD: Validate role_id exists
  private async validateRoleId(role_id: number): Promise<boolean> {
    if (!role_id) return true; // Allow null role_id
    
    const result = await this.dataSource.query(
      `SELECT role_id FROM io_role WHERE role_id = ? AND status = 'active'`,
      [role_id]
    );
    return result.length > 0;
  }

  // NEW METHOD: Get role_id by role_code
  private async getRoleIdByCode(role_code: string, company_id?: number): Promise<number | null> {
    if (!role_code) return null;
    
    let query = `
      SELECT role_id FROM io_role 
      WHERE role_code = ? 
      AND status = 'active'
    `;
    const params: any[] = [role_code];
    
    // Check company-specific role first, then system role
    if (company_id) {
      query += ` AND (company_id = ? OR company_id IS NULL)`;
      params.push(company_id);
      query += ` ORDER BY company_id DESC LIMIT 1`;
    } else {
      query += ` AND company_id IS NULL LIMIT 1`;
    }
    
    const result = await this.dataSource.query(query, params);
    return result.length > 0 ? result[0].role_id : null;
  }

  async addIouserWithPhoto(iouserDto: any): Promise<{ status: string; message: string }> {
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
        branch_id,
        company_id,
        status,
        role_id,      // NEW: accept role_id
        role_code,    // NEW: OR accept role_code
        account_bank_id,
        account_no,
        account_name,
        language,
        bio,
        online,
      } = iouserDto;

      console.log(`Adding user with phone: ${phone}, company_id: ${company_id}, branch_id: ${branch_id}`);

      // DETERMINE role_id
      let finalRoleId = role_id;
      
      // If role_code provided instead of role_id, convert it
      if (!finalRoleId && role_code) {
        finalRoleId = await this.getRoleIdByCode(role_code, company_id);
        if (!finalRoleId) {
          throw new HttpException(
            {
              status: 'error',
              message: `Invalid role_code: ${role_code}`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // VALIDATE role_id if provided
      if (finalRoleId) {
        const isValidRole = await this.validateRoleId(finalRoleId);
        if (!isValidRole) {
          throw new HttpException(
            {
              status: 'error',
              message: `Invalid role_id: ${finalRoleId}. Role does not exist or is inactive.`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // PHONE NUMBER VALIDATION
      if (phone && company_id) {
        const existingUserQuery = `
          SELECT phone, company_id, status, name 
          FROM io_user 
          WHERE phone = ? AND company_id = ?
        `;
        const existingUsers = await this.dataSource.query(existingUserQuery, [phone, company_id]);

        if (existingUsers && existingUsers.length > 0) {
          const existingUser = existingUsers[0];
          console.log(`Found existing user:`, existingUser);

          if (existingUser.status !== 'delete') {
            console.log(`❌ REJECTING: Phone ${phone} already exists in company ${company_id}`);
            throw new HttpException(
              {
                status: 'error',
                message: `Phone number ${phone} already exists in this company`,
                details: `Existing user "${existingUser.name}" has status: ${existingUser.status}`,
              },
              HttpStatus.CONFLICT,
            );
          } else {
            console.log(`✅ ALLOWING: Existing user has status 'delete', can be replaced`);
          }
        }
      }

      // Save images
      const photoFilename = await this.saveImage(photo);
      const photoIdFilename = await this.saveImage(photo_id);

      // INSERT with role_id instead of role
      const sql = `
        INSERT INTO io_user (
          name, username, email, password, phone, document_id,
          photo, photo_id, village_id, district_id, province_id,
          branch_id, company_id, status, role_id, account_bank_id, 
          account_no, account_name, language, bio, online
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        name || null,
        username || null,
        email || null,
        password || null, // ⚠️ WARNING: Should hash password before storing!
        phone || null,
        document_id || null,
        photoFilename,
        photoIdFilename,
        village_id || null,
        district_id || null,
        province_id || null,
        branch_id || null,
        company_id || null,
        status || 'active',
        finalRoleId || null,  // CHANGED: from 'role' to 'role_id'
        account_bank_id || null,
        account_no || null,
        account_name || null,
        language || null,
        bio || null,
        online || null
      ];

      console.log('Executing SQL:', sql);
      console.log('With values:', values);
      
      await this.dataSource.query(sql, values);

      console.log(`✅ User created successfully: ${name} (${phone}) in company ${company_id}`);
      return {
        status: 'success',
        message: 'User created successfully',
      };
    } catch (error) {
      console.error('Error creating user:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;
    console.log('Saving image...');
    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'iouser');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await fs.writeFile(filePath, data, 'base64');
      return uniqueName;
    } catch (error) {
      console.error('Failed to save image:', error.message);
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  private parseBase64Image(base64Str: string): { mimeType: string; data: string } {
    const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
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

  async updateIouserWithPhoto(
    phone: string,
    iouserDto: any,
  ): Promise<{ status: string; message: string }> {
    try {
      console.log('📝 Received iouserDto:', JSON.stringify(iouserDto, null, 2));

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
        branch_id,
        company_id,
        status,
        role_id,      // CHANGED: from 'role' to 'role_id'
        role_code,    // NEW: support role_code
        account_bank_id,
        account_no,
        account_name,
        language,
        online,
        bio,
      } = iouserDto;

      // Find existing user
      const [existingUser] = await this.dataSource.query(
        `SELECT photo, photo_id, company_id FROM io_user WHERE phone = ?`,
        [phone],
      );
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // DETERMINE role_id if role_code provided
      let finalRoleId = role_id;
      if (!finalRoleId && role_code) {
        finalRoleId = await this.getRoleIdByCode(role_code, existingUser.company_id);
        if (!finalRoleId) {
          throw new HttpException(
            {
              status: 'error',
              message: `Invalid role_code: ${role_code}`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // VALIDATE role_id if provided
      if (finalRoleId) {
        const isValidRole = await this.validateRoleId(finalRoleId);
        if (!isValidRole) {
          throw new HttpException(
            {
              status: 'error',
              message: `Invalid role_id: ${finalRoleId}`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Handle photos
      const photoFilename = photo ? await this.saveImage(photo) : existingUser.photo;
      const photoIdFilename = photo_id ? await this.saveImage(photo_id) : existingUser.photo_id;

      // Prepare fields to update
      const updates: string[] = [];
      const values: any[] = [];

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
      addField('branch_id', branch_id);
      addField('company_id', company_id);
      addField('status', status);
      addField('role_id', finalRoleId);  // CHANGED: from 'role' to 'role_id'
      addField('account_bank_id', account_bank_id);
      addField('account_no', account_no);
      addField('account_name', account_name);
      addField('bio', bio);
      addField('online', online);
      addField('language', language);

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(phone);

      const sql = `
        UPDATE io_user SET
          ${updates.join(', ')}
        WHERE phone = ?
      `;

      console.log('🧾 Executing SQL:\n', sql);
      console.log('📦 With values:', values);

      await this.dataSource.query(sql, values);

      console.log('✅ User update complete for phone:', phone);
      return {
        status: 'success',
        message: 'User updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating user:', error.message);
      
      if (error instanceof NotFoundException || error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}