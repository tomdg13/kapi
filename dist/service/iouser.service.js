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
exports.iouserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let iouserService = class iouserService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findIouserById(dto) {
        try {
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
    async findIousersByCompany(company_id) {
        try {
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
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const usersWithPhotos = result.map((user) => ({
                ...user,
                photo: user.photo ? imageBaseUrl + user.photo : null,
                photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
            }));
            return {
                status: 'success',
                message: `Found ${result.length} users for company ${company_id}`,
                data: usersWithPhotos,
            };
        }
        catch (error) {
            console.error('Error fetching users by company:', error);
            return {
                status: 'error',
                message: 'Failed to fetch users by company',
                error: error.message,
            };
        }
    }
    async searchUsers(searchParams) {
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
            const params = [];
            if (searchParams.company_id) {
                query += ` AND u.company_id = ?`;
                params.push(searchParams.company_id);
            }
            if (searchParams.role_id) {
                query += ` AND u.role_id = ?`;
                params.push(searchParams.role_id);
            }
            if (searchParams.role_code) {
                query += ` AND r.role_code = ?`;
                params.push(searchParams.role_code);
            }
            if (searchParams.status) {
                query += ` AND u.status = ?`;
                params.push(searchParams.status);
            }
            if (searchParams.search_text) {
                query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
                const searchTerm = `%${searchParams.search_text}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }
            query += ` ORDER BY u.name ASC`;
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const usersWithPhotos = result.map((user) => ({
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
        }
        catch (error) {
            console.error('Error searching users:', error);
            return {
                status: 'error',
                message: 'Failed to search users',
                error: error.message,
            };
        }
    }
    async findIousersByRole(dto) {
        try {
            let query;
            let params = [];
            if (dto.role?.toLowerCase() === 'admin' || dto.role_code?.toLowerCase() === 'admin') {
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
            }
            else {
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
                if (dto.role_id) {
                    query += ` AND u.role_id = ?`;
                    params.push(dto.role_id);
                }
                if (dto.role_code) {
                    query += ` AND r.role_code = ?`;
                    params.push(dto.role_code);
                }
                if (dto.company_id) {
                    query += ` AND u.company_id = ?`;
                    params.push(dto.company_id);
                }
            }
            query += ` ORDER BY u.name ASC`;
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const usersWithPhotos = result.map((user) => ({
                ...user,
                photo: user.photo ? imageBaseUrl + user.photo : null,
                photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
            }));
            return {
                status: 'success',
                message: `Users fetched successfully`,
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
    async validateRoleId(role_id) {
        if (!role_id)
            return true;
        const result = await this.dataSource.query(`SELECT role_id FROM io_role WHERE role_id = ? AND status = 'active'`, [role_id]);
        return result.length > 0;
    }
    async getRoleIdByCode(role_code, company_id) {
        if (!role_code)
            return null;
        let query = `
      SELECT role_id FROM io_role 
      WHERE role_code = ? 
      AND status = 'active'
    `;
        const params = [role_code];
        if (company_id) {
            query += ` AND (company_id = ? OR company_id IS NULL)`;
            params.push(company_id);
            query += ` ORDER BY company_id DESC LIMIT 1`;
        }
        else {
            query += ` AND company_id IS NULL LIMIT 1`;
        }
        const result = await this.dataSource.query(query, params);
        return result.length > 0 ? result[0].role_id : null;
    }
    async addIouserWithPhoto(iouserDto) {
        try {
            const { name, username, email, password, phone, document_id, photo, photo_id, village_id, district_id, province_id, branch_id, company_id, status, role_id, role_code, account_bank_id, account_no, account_name, language, bio, online, } = iouserDto;
            console.log(`Adding user with phone: ${phone}, company_id: ${company_id}, branch_id: ${branch_id}`);
            let finalRoleId = role_id;
            if (!finalRoleId && role_code) {
                finalRoleId = await this.getRoleIdByCode(role_code, company_id);
                if (!finalRoleId) {
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Invalid role_code: ${role_code}`,
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            if (finalRoleId) {
                const isValidRole = await this.validateRoleId(finalRoleId);
                if (!isValidRole) {
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Invalid role_id: ${finalRoleId}. Role does not exist or is inactive.`,
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
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
                        throw new common_1.HttpException({
                            status: 'error',
                            message: `Phone number ${phone} already exists in this company`,
                            details: `Existing user "${existingUser.name}" has status: ${existingUser.status}`,
                        }, common_1.HttpStatus.CONFLICT);
                    }
                    else {
                        console.log(`✅ ALLOWING: Existing user has status 'delete', can be replaced`);
                    }
                }
            }
            const photoFilename = await this.saveImage(photo);
            const photoIdFilename = await this.saveImage(photo_id);
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
                password || null,
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
                finalRoleId || null,
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
        }
        catch (error) {
            console.error('Error creating user:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create user',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveImage(base64Str) {
        if (!base64Str)
            return null;
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
        }
        catch (error) {
            console.error('Failed to save image:', error.message);
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    parseBase64Image(base64Str) {
        const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string format');
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
    async updateIouserWithPhoto(phone, iouserDto) {
        try {
            console.log('📝 Received iouserDto:', JSON.stringify(iouserDto, null, 2));
            const { name, username, email, phone: newPhone, document_id, photo, photo_id, village_id, district_id, province_id, branch_id, company_id, status, role_id, role_code, account_bank_id, account_no, account_name, language, online, bio, } = iouserDto;
            const [existingUser] = await this.dataSource.query(`SELECT photo, photo_id, company_id FROM io_user WHERE phone = ?`, [phone]);
            if (!existingUser) {
                throw new common_1.NotFoundException('User not found');
            }
            let finalRoleId = role_id;
            if (!finalRoleId && role_code) {
                finalRoleId = await this.getRoleIdByCode(role_code, existingUser.company_id);
                if (!finalRoleId) {
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Invalid role_code: ${role_code}`,
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            if (finalRoleId) {
                const isValidRole = await this.validateRoleId(finalRoleId);
                if (!isValidRole) {
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Invalid role_id: ${finalRoleId}`,
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const photoFilename = photo ? await this.saveImage(photo) : existingUser.photo;
            const photoIdFilename = photo_id ? await this.saveImage(photo_id) : existingUser.photo_id;
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
            addField('role_id', finalRoleId);
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
        }
        catch (error) {
            console.error('❌ Error updating user:', error.message);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update user',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.iouserService = iouserService;
exports.iouserService = iouserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], iouserService);
//# sourceMappingURL=iouser.service.js.map