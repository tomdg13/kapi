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
exports.IobranchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let IobranchService = class IobranchService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findbranchById(dto) {
        try {
            console.log(`🔍 GET BRANCH BY ID: ${dto.id}`);
            const query = `SELECT * FROM io_branch WHERE branch_id = ?`;
            const result = await this.dataSource.query(query, [dto.id]);
            if (result.length === 0) {
                console.log(`❌ Branch with ID ${dto.id} not found`);
                return {
                    status: 'not_found',
                    message: `branch with ID ${dto.id} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const branchWithImageUrl = result.map((branch) => ({
                ...branch,
                image_url: branch.branch_image ? imageBaseUrl + branch.branch_image : null,
            }));
            console.log(`✅ Branch found: ${result[0].branch_name} (${result[0].branch_code})`);
            return {
                status: 'success',
                message: 'branch fetched successfully',
                data: branchWithImageUrl,
            };
        }
        catch (error) {
            console.error('❌ Error fetching branch:', error);
            return {
                status: 'error',
                message: 'Failed to fetch branch info',
                error: error.message,
            };
        }
    }
    async findbranchsByStatus(dto) {
        try {
            console.log('🔍 GET BRANCHES REQUEST:', JSON.stringify(dto, null, 2));
            let query;
            let params = [];
            if (dto.status?.toLowerCase() === 'admin') {
                if (dto.company_id) {
                    query = `SELECT * FROM io_branch WHERE company_id = ?`;
                    params.push(dto.company_id);
                    console.log(`📊 Admin query for company_id: ${dto.company_id}`);
                }
                else {
                    query = `SELECT * FROM io_branch`;
                    console.log('📊 Admin query for all companies');
                }
            }
            else {
                if (dto.company_id) {
                    query = `SELECT * FROM io_branch WHERE company_id = ?`;
                    params.push(dto.company_id);
                    console.log(`📊 Regular query for company_id: ${dto.company_id}`);
                }
                else {
                    query = `SELECT * FROM io_branch`;
                    console.log('📊 Query for all branches');
                }
            }
            console.log('🗃️ Executing SQL:', query);
            console.log('📦 With params:', params);
            const result = await this.dataSource.query(query, params);
            console.log(`✅ Found ${result.length} branches`);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const branchsWithImageUrls = result.map((branch) => ({
                ...branch,
                image_url: branch.branch_image ? imageBaseUrl + branch.branch_image : null,
            }));
            const message = dto.status?.toLowerCase() === 'admin'
                ? `All branches fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
                : `branches fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`;
            console.log(`✅ Returning ${result.length} branches with message: "${message}"`);
            return {
                status: 'success',
                message,
                data: branchsWithImageUrls,
            };
        }
        catch (error) {
            console.error('❌ Error fetching branches by status:', error);
            return {
                status: 'error',
                message: 'Failed to fetch branches',
                error: error.message,
            };
        }
    }
    async addbranchWithImage(branchDto) {
        try {
            console.log('🚀 CREATE BRANCH REQUEST:', JSON.stringify({
                ...branchDto,
                image: branchDto.image ? `[BASE64_IMAGE_${branchDto.image.length}_CHARS]` : null
            }, null, 2));
            const { company_id, branch_name, branch_code, province_name, address, phone, email, manager_name, image } = branchDto;
            console.log(`📝 Extracted fields:`, {
                company_id,
                branch_name,
                branch_code,
                province_name,
                address,
                phone,
                email,
                manager_name,
                hasImage: !!image
            });
            console.log(`➕ Adding branch with name: ${branch_name}, code: ${branch_code}, company_id: ${company_id}`);
            if (!branch_name || !branch_code) {
                console.log('❌ Missing required fields: branch_name or branch_code');
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'branch_name and branch_code are required fields',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (branch_code) {
                const existingbranchQuery = `
          SELECT branch_code, company_id, branch_name 
          FROM io_branch 
          WHERE branch_code = ?
        `;
                console.log('🔍 Checking for duplicate branch code:', branch_code);
                const existingbranches = await this.dataSource.query(existingbranchQuery, [branch_code]);
                if (existingbranches && existingbranches.length > 0) {
                    const existingbranch = existingbranches[0];
                    console.log(`Found existing branch:`, existingbranch);
                    console.log(`❌ REJECTING: branch code ${branch_code} already exists`);
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Branch code ${branch_code} already exists`,
                        details: `Existing branch: "${existingbranch.branch_name}" (Code: ${existingbranch.branch_code})`,
                    }, common_1.HttpStatus.CONFLICT);
                }
                else {
                    console.log(`✅ ALLOWING: No existing branch with code ${branch_code}`);
                }
            }
            let imageFileName = null;
            if (image) {
                console.log('📷 Processing image upload...');
                imageFileName = await this.saveImage(image);
                console.log(`📷 Image saved as: ${imageFileName}`);
            }
            else {
                console.log('📷 No image provided');
            }
            const sql = `
        INSERT INTO io_branch (
          company_id, branch_name, branch_code, province_name, 
          address, phone, email, manager_name, branch_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
            const values = [
                company_id,
                branch_name,
                branch_code,
                province_name || null,
                address || null,
                phone || null,
                email || null,
                manager_name || null,
                imageFileName,
            ];
            console.log('🗃️ Executing SQL:', sql.replace(/\s+/g, ' ').trim());
            console.log('📦 With values:', values);
            const result = await this.dataSource.query(sql, values);
            console.log('📊 Insert result:', {
                insertId: result.insertId,
                affectedRows: result.affectedRows
            });
            console.log(`✅ Branch created successfully: "${branch_name}" (${branch_code}) in company ${company_id}`);
            console.log(`🎯 New branch ID: ${result.insertId}`);
            return {
                status: 'success',
                message: 'branch created successfully',
                data: {
                    branch_id: result.insertId,
                    branch_name,
                    branch_code,
                    company_id
                }
            };
        }
        catch (error) {
            console.error('❌ Error creating branch:', error.message);
            console.error('📚 Stack trace:', error.stack);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create branch',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveImage(base64Str) {
        if (!base64Str) {
            console.log('📷 No image data provided');
            return null;
        }
        try {
            console.log('📷 Saving image...');
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'iouser');
            console.log('📁 Upload path:', uploadPath);
            await fs.mkdir(uploadPath, { recursive: true });
            console.log('📁 Directory created/verified');
            const { mimeType, data } = this.parseBase64Image(base64Str);
            console.log('📷 Image mime type:', mimeType);
            const ext = this.getFileExtension(mimeType);
            const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
            const filePath = path.join(uploadPath, uniqueFileName);
            console.log('💾 Saving to:', filePath);
            await fs.writeFile(filePath, data, 'base64');
            console.log('✅ Image saved successfully:', uniqueFileName);
            return uniqueFileName;
        }
        catch (error) {
            console.error('❌ Failed to save image:', error.message);
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    parseBase64Image(base64Str) {
        const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            console.error('❌ Invalid base64 format. Expected: data:mime/type;base64,data');
            throw new Error('Invalid base64 string format');
        }
        console.log('✅ Base64 image parsed successfully');
        return {
            mimeType: matches[1],
            data: matches[2],
        };
    }
    getFileExtension(mimeType) {
        const map = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        const ext = map[mimeType.toLowerCase()] || 'png';
        console.log(`📄 File extension for ${mimeType}: ${ext}`);
        return ext;
    }
    async updatebranchWithImage(branchId, branchDto) {
        try {
            console.log(`🔄 UPDATE BRANCH REQUEST for ID: ${branchId}`);
            console.log('📝 Received branchDto:', JSON.stringify({
                ...branchDto,
                image: branchDto.image ? `[BASE64_IMAGE_${branchDto.image.length}_CHARS]` : branchDto.image
            }, null, 2));
            const { company_id, branch_name, branch_code, province_name, address, phone, email, manager_name, image } = branchDto;
            console.log(`🔍 Looking for existing branch with ID: ${branchId}`);
            const [existingbranch] = await this.dataSource.query(`SELECT branch_id, branch_name, branch_code, branch_image FROM io_branch WHERE branch_id = ?`, [branchId]);
            if (!existingbranch) {
                console.log(`❌ Branch with ID ${branchId} not found`);
                throw new common_1.NotFoundException('branch not found');
            }
            console.log(`✅ Found existing branch: "${existingbranch.branch_name}" (${existingbranch.branch_code})`);
            let imageFileName = existingbranch.branch_image;
            if (image) {
                console.log('📷 New image provided, processing...');
                imageFileName = await this.saveImage(image);
                console.log(`📷 New image saved: ${imageFileName}`);
            }
            else {
                console.log('📷 No new image, keeping existing:', existingbranch.branch_image);
            }
            const updates = [];
            const values = [];
            const addField = (fieldName, value) => {
                if (value !== null && value !== undefined && value !== '') {
                    updates.push(`${fieldName} = ?`);
                    values.push(value);
                    console.log(`📝 Will update ${fieldName}: ${value}`);
                }
            };
            addField('company_id', company_id);
            addField('branch_name', branch_name);
            addField('branch_code', branch_code);
            addField('province_name', province_name);
            addField('address', address);
            addField('phone', phone);
            addField('email', email);
            addField('manager_name', manager_name);
            addField('branch_image', imageFileName);
            if (updates.length === 0) {
                console.log('❌ No valid fields to update');
                throw new Error('No valid fields to update');
            }
            values.push(branchId);
            const sql = `
        UPDATE io_branch SET
          ${updates.join(', ')}
        WHERE branch_id = ?
      `;
            console.log('🗃️ Executing UPDATE SQL:', sql.replace(/\s+/g, ' ').trim());
            console.log('📦 With values:', values);
            const result = await this.dataSource.query(sql, values);
            console.log('📊 Update result:', {
                affectedRows: result.affectedRows,
                changedRows: result.changedRows
            });
            if (result.affectedRows === 0) {
                console.log(`❌ No rows affected for branch_id: ${branchId}`);
                throw new common_1.NotFoundException('branch not found or no changes made');
            }
            console.log(`✅ Branch update complete for branch_id: ${branchId}`);
            return {
                status: 'success',
                message: 'branch updated successfully',
            };
        }
        catch (error) {
            console.error('❌ Error updating branch:', error.message);
            console.error('📚 Stack trace:', error.stack);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update branch',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deletebranch(branchId) {
        try {
            console.log(`🗑️ DELETE BRANCH REQUEST for ID: ${branchId}`);
            const [existingbranch] = await this.dataSource.query(`SELECT branch_id, branch_name, branch_code FROM io_branch WHERE branch_id = ?`, [branchId]);
            if (!existingbranch) {
                console.log(`❌ Branch with ID ${branchId} not found`);
                throw new common_1.NotFoundException('branch not found');
            }
            console.log(`✅ Found branch to delete: "${existingbranch.branch_name}" (${existingbranch.branch_code})`);
            const sql = `DELETE FROM io_branch WHERE branch_id = ?`;
            console.log('🗃️ Executing DELETE SQL:', sql);
            console.log('📦 With branch_id:', branchId);
            const result = await this.dataSource.query(sql, [branchId]);
            console.log('📊 Delete result:', { affectedRows: result.affectedRows });
            if (result.affectedRows === 0) {
                console.log(`❌ No rows deleted for branch_id: ${branchId}`);
                throw new Error('Failed to delete branch');
            }
            console.log(`✅ Branch deleted successfully: "${existingbranch.branch_name}" (ID: ${branchId})`);
            return {
                status: 'success',
                message: 'branch deleted successfully',
            };
        }
        catch (error) {
            console.error('❌ Error deleting branch:', error.message);
            console.error('📚 Stack trace:', error.stack);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete branch',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IobranchService = IobranchService;
exports.IobranchService = IobranchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IobranchService);
//# sourceMappingURL=iobranch.service.js.map