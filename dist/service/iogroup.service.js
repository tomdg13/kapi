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
exports.IoGroupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let IoGroupService = class IoGroupService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findGroupById(dto) {
        try {
            const query = `SELECT * FROM io_group WHERE group_id = ?`;
            const result = await this.dataSource.query(query, [dto.id]);
            if (result.length === 0) {
                return {
                    status: 'not_found',
                    message: `Group with ID ${dto.id} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const groupWithImageUrl = result.map((group) => ({
                ...group,
                image_url: group.group_image ? imageBaseUrl + group.group_image : null,
            }));
            return {
                status: 'success',
                message: 'Group fetched successfully',
                data: groupWithImageUrl,
            };
        }
        catch (error) {
            console.error('Error fetching group:', error);
            return {
                status: 'error',
                message: 'Failed to fetch group info',
                error: error.message,
            };
        }
    }
    async findGroupsByStatus(dto) {
        try {
            let query;
            let params = [];
            if (dto.status?.toLowerCase() === 'admin') {
                if (dto.company_id) {
                    query = `SELECT * FROM io_group WHERE company_id = ?`;
                    params.push(dto.company_id);
                }
                else {
                    query = `SELECT * FROM io_group`;
                }
            }
            else {
                if (dto.company_id) {
                    query = `SELECT * FROM io_group WHERE company_id = ?`;
                    params.push(dto.company_id);
                }
                else {
                    query = `SELECT * FROM io_group`;
                }
            }
            if (dto.search) {
                if (params.length > 0) {
                    query += ` AND (group_name LIKE ? OR group_code LIKE ? OR group_manager LIKE ? OR phone LIKE ? OR mobile LIKE ?)`;
                }
                else {
                    query += ` WHERE (group_name LIKE ? OR group_code LIKE ? OR group_manager LIKE ? OR phone LIKE ? OR mobile LIKE ?)`;
                }
                const searchTerm = `%${dto.search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }
            if (dto.sort_by) {
                const sortOrder = dto.sort_order || 'ASC';
                query += ` ORDER BY ${dto.sort_by} ${sortOrder}`;
            }
            else {
                query += ` ORDER BY created_date DESC`;
            }
            if (dto.limit) {
                const offset = dto.page ? (dto.page - 1) * dto.limit : 0;
                query += ` LIMIT ? OFFSET ?`;
                params.push(dto.limit, offset);
            }
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const groupsWithImageUrls = result.map((group) => ({
                ...group,
                image_url: group.group_image ? imageBaseUrl + group.group_image : null,
            }));
            return {
                status: 'success',
                message: dto.status?.toLowerCase() === 'admin'
                    ? `All groups fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
                    : `Groups${dto.company_id ? ` for company ${dto.company_id}` : ''} fetched`,
                data: groupsWithImageUrls,
                pagination: dto.limit ? {
                    page: dto.page || 1,
                    limit: dto.limit,
                    total: result.length
                } : undefined
            };
        }
        catch (error) {
            console.error('Error fetching groups by status:', error);
            return {
                status: 'error',
                message: 'Failed to fetch groups',
                error: error.message,
            };
        }
    }
    async generateGroupCode(companyId, userId) {
        try {
            console.log(`🔍 Generating group code for company_id: ${companyId}, user_id: ${userId}`);
            let branchQuery;
            let branchParams;
            if (userId) {
                branchQuery = `
          SELECT b.branch_code, b.branch_name
          FROM io_user u
          LEFT JOIN io_branch b ON u.branch_id = b.branch_id
          WHERE u.company_id = ? AND u.user_id = ?
        `;
                branchParams = [companyId, userId];
            }
            else {
                branchQuery = `
          SELECT b.branch_code, b.branch_name
          FROM io_user u
          LEFT JOIN io_branch b ON u.branch_id = b.branch_id
          WHERE u.company_id = ? AND b.branch_code IS NOT NULL AND b.branch_name IS NOT NULL
          LIMIT 1
        `;
                branchParams = [companyId];
            }
            const branchResult = await this.dataSource.query(branchQuery, branchParams);
            console.log('🏢 Branch info result:', branchResult);
            if (!branchResult || branchResult.length === 0) {
                const fallbackCode = `GDEF${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
                console.log(`⚠️ No branch found, using fallback code: ${fallbackCode}`);
                return fallbackCode;
            }
            const { branch_code, branch_name } = branchResult[0];
            const prefix = `G${branch_code}${branch_name}`;
            const sequenceQuery = `
        SELECT 
          IFNULL(
            MAX(CAST(RIGHT(group_code, 4) AS UNSIGNED)), 0
          ) + 1 as next_sequence
        FROM io_group 
        WHERE company_id = ? 
        AND group_code LIKE ?
      `;
            const sequenceResult = await this.dataSource.query(sequenceQuery, [
                companyId,
                `${prefix}%`
            ]);
            console.log('📊 Sequence query result:', sequenceResult);
            const nextSequence = sequenceResult[0]?.next_sequence || 1;
            const paddedSequence = String(nextSequence).padStart(4, '0');
            const generatedCode = `${prefix}${paddedSequence}`;
            console.log(`✅ Generated CONTINUOUS group_code: ${generatedCode} for company ${companyId}`);
            return generatedCode;
        }
        catch (error) {
            console.error('❌ Error in generateGroupCode:', error);
            const fallbackCode = `GERR${Date.now().toString().slice(-4)}`;
            console.log(`🆘 Using emergency fallback code: ${fallbackCode}`);
            return fallbackCode;
        }
    }
    async addGroupWithImage(groupDto) {
        try {
            const { company_id, group_name, group_code, phone, mobile, image, user_id } = groupDto;
            console.log(`Adding group with group_name: ${group_name}, company_id: ${company_id}, phone: ${phone}`);
            let finalUserId = user_id;
            if (!finalUserId && phone) {
                console.log(`Looking up user_id for phone: ${phone} in company: ${company_id}`);
                const userLookupQuery = `SELECT user_id FROM io_user WHERE phone = ? AND company_id = ?`;
                const userResult = await this.dataSource.query(userLookupQuery, [phone, company_id]);
                if (userResult && userResult.length > 0) {
                    finalUserId = userResult[0].user_id;
                    console.log(`Found user_id: ${finalUserId} for phone: ${phone}`);
                }
                else {
                    console.log(`No user found for phone: ${phone} in company: ${company_id}`);
                }
            }
            const autoGeneratedGroupCode = await this.generateGroupCode(company_id, finalUserId);
            if (group_name && company_id) {
                const existingGroupQuery = `
          SELECT group_name, group_code, company_id 
          FROM io_group 
          WHERE group_name = ? AND company_id = ?
        `;
                const queryParams = [group_name, company_id];
                const existingGroups = await this.dataSource.query(existingGroupQuery, queryParams);
                if (existingGroups && existingGroups.length > 0) {
                    const existingGroup = existingGroups[0];
                    console.log(`Found existing group:`, existingGroup);
                    console.log(`❌ REJECTING: Group already exists in company ${company_id}`);
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Group already exists in this company`,
                        details: `Existing group "${existingGroup.group_name}"`,
                    }, common_1.HttpStatus.CONFLICT);
                }
                else {
                    console.log(`✅ ALLOWING: No existing group with same name in company ${company_id}`);
                }
            }
            const imageFileName = await this.saveImage(image);
            const sql = `
        INSERT INTO io_group (
          company_id, group_name, group_code, phone, mobile, group_image, create_by, created_date, updated_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
            const values = [
                company_id,
                group_name,
                autoGeneratedGroupCode,
                phone,
                mobile,
                imageFileName,
                finalUserId
            ];
            console.log('Executing SQL with values:', values);
            const result = await this.dataSource.query(sql, values);
            const createdGroup = await this.dataSource.query(`SELECT * FROM io_group WHERE group_id = ?`, [result.insertId]);
            console.log(`✅ Group created successfully: ${group_name} with code ${autoGeneratedGroupCode} in company ${company_id}`);
            return {
                status: 'success',
                message: `Group created successfully with auto-generated code: ${autoGeneratedGroupCode}`,
                data: {
                    group_id: result.insertId,
                    group_code: autoGeneratedGroupCode,
                    user_id: finalUserId,
                    ...createdGroup[0]
                }
            };
        }
        catch (error) {
            console.error('Error creating group:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveImage(base64Str) {
        if (!base64Str)
            return null;
        try {
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'iouser');
            await fs.mkdir(uploadPath, { recursive: true });
            const { mimeType, data } = this.parseBase64Image(base64Str);
            const ext = this.getFileExtension(mimeType);
            const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
            const filePath = path.join(uploadPath, uniqueFileName);
            await fs.writeFile(filePath, data, 'base64');
            console.log(`📁 Image saved: ${uniqueFileName}`);
            return uniqueFileName;
        }
        catch (error) {
            console.error('❌ Error saving image:', error);
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
            'image/bmp': 'bmp',
            'image/tiff': 'tiff'
        };
        return map[mimeType] || 'png';
    }
    async updateGroupWithImage(groupId, groupDto) {
        try {
            console.log('📝 Received groupDto:', JSON.stringify(groupDto, null, 2));
            const { company_id, group_name, group_code, phone, mobile, image } = groupDto;
            const [existingGroup] = await this.dataSource.query(`SELECT * FROM io_group WHERE group_id = ?`, [groupId]);
            if (!existingGroup) {
                throw new common_1.NotFoundException('Group not found');
            }
            let imageFileName = existingGroup.group_image;
            if (image) {
                if (existingGroup.group_image) {
                    try {
                        const oldImagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingGroup.group_image);
                        await fs.unlink(oldImagePath);
                        console.log(`🗑️ Old image deleted: ${existingGroup.group_image}`);
                    }
                    catch (imageError) {
                        console.warn(`⚠️ Could not delete old image: ${imageError.message}`);
                    }
                }
                imageFileName = await this.saveImage(image);
            }
            const updates = [];
            const values = [];
            const addField = (fieldName, value) => {
                if (value !== null && value !== undefined) {
                    updates.push(`${fieldName} = ?`);
                    values.push(value);
                }
            };
            addField('company_id', company_id);
            addField('group_name', group_name);
            addField('group_code', group_code);
            addField('phone', phone);
            addField('mobile', mobile);
            addField('group_image', imageFileName);
            updates.push('updated_date = NOW()');
            if (updates.length <= 1) {
                throw new Error('No valid fields to update');
            }
            values.push(groupId);
            const sql = `
        UPDATE io_group SET
          ${updates.join(', ')}
        WHERE group_id = ?
      `;
            console.log('🧾 Executing SQL:\n', sql);
            console.log('📦 With values:', values);
            const result = await this.dataSource.query(sql, values);
            if (result.affectedRows === 0) {
                throw new common_1.NotFoundException('Group not found or no changes made');
            }
            const [updatedGroup] = await this.dataSource.query(`SELECT * FROM io_group WHERE group_id = ?`, [groupId]);
            console.log('✅ Group update complete for group_id:', groupId);
            return {
                status: 'success',
                message: 'Group updated successfully',
                data: updatedGroup
            };
        }
        catch (error) {
            console.error('❌ Error updating group:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteGroup(groupId) {
        try {
            const [existingGroup] = await this.dataSource.query(`SELECT group_id, group_name, group_image FROM io_group WHERE group_id = ?`, [groupId]);
            if (!existingGroup) {
                throw new common_1.NotFoundException('Group not found');
            }
            if (existingGroup.group_image) {
                try {
                    const imagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingGroup.group_image);
                    await fs.unlink(imagePath);
                    console.log(`🗑️ Image file deleted: ${existingGroup.group_image}`);
                }
                catch (imageError) {
                    console.warn(`⚠️ Could not delete image file: ${imageError.message}`);
                }
            }
            const sql = `DELETE FROM io_group WHERE group_id = ?`;
            const result = await this.dataSource.query(sql, [groupId]);
            if (result.affectedRows === 0) {
                throw new Error('Failed to delete group');
            }
            console.log(`✅ Group deleted successfully: ${existingGroup.group_name} (ID: ${groupId})`);
            return {
                status: 'success',
                message: 'Group deleted successfully',
            };
        }
        catch (error) {
            console.error('❌ Error deleting group:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getGroupStats(companyId) {
        try {
            let query = `
        SELECT 
          COUNT(*) as total_groups,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_groups,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_groups,
          COUNT(CASE WHEN group_image IS NOT NULL THEN 1 END) as groups_with_images,
          COUNT(CASE WHEN mobile IS NOT NULL THEN 1 END) as groups_with_mobile
        FROM io_group
      `;
            const params = [];
            if (companyId) {
                query += ` WHERE company_id = ?`;
                params.push(companyId);
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Group statistics fetched successfully',
                data: result[0]
            };
        }
        catch (error) {
            console.error('Error fetching group stats:', error);
            return {
                status: 'error',
                message: 'Failed to fetch group statistics',
                error: error.message,
            };
        }
    }
};
exports.IoGroupService = IoGroupService;
exports.IoGroupService = IoGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IoGroupService);
//# sourceMappingURL=iogroup.service.js.map