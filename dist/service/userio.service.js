"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
let userioService = class userioService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findUserioById(dto) {
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
            const userWithoutPassword = result.map(user => {
                const { password, ...userWithoutPass } = user;
                return userWithoutPass;
            });
            return {
                status: 'success',
                message: 'User fetched successfully',
                data: userWithoutPassword,
            };
        }
        catch (error) {
            console.error('Error fetching user:', error);
            return {
                status: 'error',
                message: 'Failed to fetch user info',
                error: error.message,
            };
        }
    }
    async findUseriosByRole(dto) {
        try {
            let query;
            let params = [];
            if (dto.role?.toLowerCase() === 'admin') {
                query = `SELECT user_id, name, username, email, phone, document_id, photo, photo_id, 
                        village_id, district_id, province_id, branch_id, company_id, status, role, 
                        account_bank_id, account_no, account_name, language, bio, online 
                 FROM io_user`;
            }
            else {
                query = `SELECT user_id, name, username, email, phone, document_id, photo, photo_id, 
                        village_id, district_id, province_id, branch_id, company_id, status, role, 
                        account_bank_id, account_no, account_name, language, bio, online 
                 FROM io_user WHERE role = ?`;
                params.push(dto.role);
            }
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/user/`;
            const usersWithPhotos = result.map((user) => ({
                ...user,
                photo: user.photo ? imageBaseUrl + user.photo : null,
                photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
            }));
            return {
                status: 'success',
                message: dto.role?.toLowerCase() === 'admin' ? 'All users fetched' : `Users with role ${dto.role} fetched`,
                data: usersWithPhotos,
            };
        }
        catch (error) {
            console.error('Error fetching users by role:', error);
            return {
                status: 'error',
                message: 'Failed to fetch users',
                error: error.message,
            };
        }
    }
    async addUserioWithPhoto(userioDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { name, username, email, password, phone, document_id, photo, photo_id, village_id, district_id, province_id, branch_id, company_id, status = 'active', role = 'user', account_bank_id, account_no, account_name, language = 'en', bio, online = 'false', } = userioDto;
            const existingUser = await queryRunner.query(`SELECT user_id FROM io_user WHERE email = ? OR phone = ? OR username = ?`, [email, phone, username]);
            if (existingUser.length > 0) {
                throw new common_1.HttpException('User with this email, phone, or username already exists', common_1.HttpStatus.CONFLICT);
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            let photoFilename = null;
            let photoIdFilename = null;
            try {
                if (photo) {
                    photoFilename = await this.saveImage(photo);
                }
                if (photo_id) {
                    photoIdFilename = await this.saveImage(photo_id);
                }
            }
            catch (imageError) {
                if (photoFilename)
                    await this.deleteImage(photoFilename);
                if (photoIdFilename)
                    await this.deleteImage(photoIdFilename);
                throw new Error(`Image processing failed: ${imageError.message}`);
            }
            const sql = `
        INSERT INTO io_user (
          user_id, name, username, email, password, phone, document_id,
          photo, photo_id, village_id, district_id, province_id, 
          branch_id, company_id, status, role, account_bank_id, 
          account_no, account_name, language, bio, online
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const params = [
                null,
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
                branch_id,
                company_id,
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ Error creating user:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create user',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateUserioWithPhoto(phone, userioDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log('📝 Received userioDto:', JSON.stringify(userioDto, null, 2));
            const { name, username, email, phone: newPhone, document_id, photo, photo_id, village_id, district_id, province_id, branch_id, company_id, status, role, account_bank_id, account_no, account_name, language, online, bio, password, } = userioDto;
            const [existingUser] = await queryRunner.query(`SELECT user_id, photo, photo_id, email, username FROM io_user WHERE phone = ?`, [phone]);
            if (!existingUser) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (email && email !== existingUser.email) {
                const emailConflict = await queryRunner.query(`SELECT user_id FROM io_user WHERE email = ? AND phone != ?`, [email, phone]);
                if (emailConflict.length > 0) {
                    throw new common_1.HttpException('Email already in use', common_1.HttpStatus.CONFLICT);
                }
            }
            if (username && username !== existingUser.username) {
                const usernameConflict = await queryRunner.query(`SELECT user_id FROM io_user WHERE username = ? AND phone != ?`, [username, phone]);
                if (usernameConflict.length > 0) {
                    throw new common_1.HttpException('Username already in use', common_1.HttpStatus.CONFLICT);
                }
            }
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
            }
            catch (imageError) {
                throw new Error(`Image processing failed: ${imageError.message}`);
            }
            const updates = [];
            const values = [];
            function addField(fieldName, value) {
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
            addField('role', role);
            addField('account_bank_id', account_bank_id);
            addField('account_no', account_no);
            addField('account_name', account_name);
            addField('bio', bio);
            addField('online', online);
            addField('language', language);
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 12);
                addField('password', hashedPassword);
            }
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
            console.log('📦 With values:', values.map(v => typeof v === 'string' && v.length > 50 ? `${v.substring(0, 50)}...` : v));
            await queryRunner.query(sql, values);
            await queryRunner.commitTransaction();
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ Error updating user:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update user',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async saveImage(base64Str) {
        if (!base64Str)
            return null;
        try {
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'user');
            await fs.mkdir(uploadPath, { recursive: true });
            const { mimeType, data } = this.parseBase64Image(base64Str);
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
        }
        catch (error) {
            console.error('❌ Failed to save image:', error.message);
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    async deleteImage(filename) {
        if (!filename)
            return;
        try {
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'user');
            const filePath = path.join(uploadPath, filename);
            try {
                await fs.access(filePath);
                await fs.unlink(filePath);
                console.log('🗑️ Deleted old image:', filename);
            }
            catch (err) {
                console.log('📁 Image file not found for deletion:', filename);
            }
        }
        catch (error) {
            console.error('❌ Error deleting image:', error.message);
        }
    }
    parseBase64Image(base64Str) {
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
    getFileExtension(mimeType) {
        const map = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        return map[mimeType] || 'png';
    }
    async deleteUserio(phone) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const [existingUser] = await queryRunner.query(`SELECT photo, photo_id FROM io_user WHERE phone = ?`, [phone]);
            if (!existingUser) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            await queryRunner.query(`DELETE FROM io_user WHERE phone = ?`, [phone]);
            await queryRunner.commitTransaction();
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ Error deleting user:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete user',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.userioService = userioService;
exports.userioService = userioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], userioService);
//# sourceMappingURL=userio.service.js.map