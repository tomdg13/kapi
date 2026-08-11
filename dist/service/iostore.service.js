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
var IoStoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoStoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let IoStoreService = IoStoreService_1 = class IoStoreService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(IoStoreService_1.name);
    }
    async findStoreById(dto) {
        try {
            const query = `
        SELECT s.*, 
               g.group_name,
               m.merchant_name
        FROM io_store s
        LEFT JOIN io_group g ON s.group_id = g.group_id
        LEFT JOIN io_merchant m ON s.merchant_id = m.merchant_id
        WHERE s.store_id = ?
        ORDER BY s.store_id DESC
      `;
            const result = await this.dataSource.query(query, [dto.id]);
            if (result.length === 0) {
                return {
                    status: 'not_found',
                    message: `Store with ID ${dto.id} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const storeWithImageUrl = result.map((store) => ({
                ...store,
                image_url: store.store_image ? imageBaseUrl + store.store_image : null,
            }));
            return {
                status: 'success',
                message: 'Store fetched successfully',
                data: storeWithImageUrl,
            };
        }
        catch (error) {
            this.logger.error('Error fetching store:', error);
            return {
                status: 'error',
                message: 'Failed to fetch store info',
                error: error.message,
            };
        }
    }
    async findStoresByStatus(dto) {
        try {
            const { status, company_id, group_id, merchant_id } = dto;
            let query = `
        SELECT s.*, 
               g.group_name,
               m.merchant_name
        FROM io_store s
        LEFT JOIN io_group g ON s.group_id = g.group_id
        LEFT JOIN io_merchant m ON s.merchant_id = m.merchant_id
      `;
            const whereConditions = [];
            const params = [];
            if (status?.toLowerCase() !== 'admin') {
                if (company_id) {
                    whereConditions.push('s.company_id = ?');
                    params.push(company_id);
                }
                if (status) {
                    whereConditions.push('s.status = ?');
                    params.push(status);
                }
                if (group_id) {
                    whereConditions.push('s.group_id = ?');
                    params.push(group_id);
                }
                if (merchant_id) {
                    whereConditions.push('s.merchant_id = ?');
                    params.push(merchant_id);
                }
            }
            else if (company_id) {
                whereConditions.push('s.company_id = ?');
                params.push(company_id);
            }
            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }
            query += ' ORDER BY s.store_id DESC';
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const storesWithImageUrls = result.map((store) => ({
                ...store,
                image_url: store.store_image ? imageBaseUrl + store.store_image : null,
            }));
            return {
                status: 'success',
                message: status?.toLowerCase() === 'admin'
                    ? `All stores fetched${company_id ? ` for company ${company_id}` : ''}`
                    : 'Stores fetched successfully',
                data: storesWithImageUrls,
            };
        }
        catch (error) {
            this.logger.error('Error fetching stores by status:', error);
            return {
                status: 'error',
                message: 'Failed to fetch stores',
                error: error.message,
            };
        }
    }
    async generateStoreCode(companyId, userId) {
        try {
            this.logger.log(`Generating store code for company_id: ${companyId}, user_id: ${userId}`);
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
            if (!branchResult?.length) {
                const fallbackCode = `SDEF${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
                this.logger.warn(`No branch found, using fallback code: ${fallbackCode}`);
                return fallbackCode;
            }
            const { branch_code, branch_name } = branchResult[0];
            const prefix = `S${branch_code}${branch_name}`;
            const sequenceQuery = `
        SELECT 
          IFNULL(
            MAX(CAST(RIGHT(store_code, 8) AS UNSIGNED)), 0
          ) + 1 as next_sequence
        FROM io_store 
        WHERE company_id = ? 
        AND store_code LIKE ?
      `;
            const sequenceResult = await this.dataSource.query(sequenceQuery, [
                companyId,
                `${prefix}%`
            ]);
            const nextSequence = sequenceResult[0]?.next_sequence || 1;
            const paddedSequence = String(nextSequence).padStart(8, '0');
            const generatedCode = `${prefix}${paddedSequence}`;
            this.logger.log(`Generated store_code: ${generatedCode}`);
            return generatedCode;
        }
        catch (error) {
            this.logger.error('Error in generateStoreCode:', error);
            const fallbackCode = `SERR${Date.now().toString().slice(-8)}`;
            this.logger.warn(`Using emergency fallback code: ${fallbackCode}`);
            return fallbackCode;
        }
    }
    async addStoreWithImage(storeDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { company_id, group_id, merchant_id, store_name, store_code: providedStoreCode, store_manager, email, phone, address, city, state, country, postal_code, store_type, status, opening_hours, square_footage, notes, image, upi_percentage = 0.00, visa_percentage = 0.00, master_percentage = 0.00, account, account2, store_mode, web, email1, email2, email3, email4, email5, mcc, account_name, cif, approve1, approve2, user_id } = storeDto;
            if (!company_id || !store_name) {
                throw new common_1.HttpException('Company ID and store name are required', common_1.HttpStatus.BAD_REQUEST);
            }
            let finalUserId = user_id;
            if (!finalUserId && phone) {
                const userResult = await queryRunner.query(`SELECT user_id FROM io_user WHERE phone = ? AND company_id = ?`, [phone, company_id]);
                if (userResult?.length > 0) {
                    finalUserId = userResult[0].user_id;
                    this.logger.log(`Found user_id: ${finalUserId} for phone: ${phone}`);
                }
            }
            const store_code = providedStoreCode || await this.generateStoreCode(company_id, finalUserId);
            await this.validateStoreUniqueness(queryRunner, store_name, store_code, company_id);
            await this.validateForeignKeys(queryRunner, company_id, group_id, merchant_id);
            const imageFileName = await this.saveImage(image);
            const sql = `
        INSERT INTO io_store (
          company_id, group_id, merchant_id, store_name, store_code, store_manager, 
          email, phone, address, city, state, country, postal_code, store_type, 
          status, opening_hours, square_footage, notes, store_image, 
          upi_percentage, visa_percentage, master_percentage, account, account2, 
          store_mode, web, email1, email2, email3, email4, email5, mcc, account_name,
          cif, approve1, approve2, created_date, updated_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
            const values = [
                company_id, group_id, merchant_id, store_name, store_code, store_manager,
                email, phone, address, city, state, country, postal_code, store_type,
                status, opening_hours, square_footage, notes, imageFileName,
                upi_percentage, visa_percentage, master_percentage, account, account2,
                store_mode, web, email1, email2, email3, email4, email5, mcc, account_name,
                cif, approve1, approve2
            ];
            const result = await queryRunner.query(sql, values);
            await queryRunner.commitTransaction();
            this.logger.log(`Store created successfully: ${store_name} with code ${store_code}`);
            return {
                status: 'success',
                message: `Store created successfully with code: ${store_code}`,
                data: {
                    store_id: result.insertId,
                    store_name,
                    store_code,
                    company_id,
                    group_id,
                    merchant_id,
                    user_id: finalUserId
                }
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error creating store:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create store',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async validateStoreUniqueness(queryRunner, storeName, storeCode, companyId, excludeStoreId) {
        let query = `SELECT store_name, store_code FROM io_store 
                 WHERE (store_name = ? OR store_code = ?) AND company_id = ?`;
        const params = [storeName, storeCode, companyId];
        if (excludeStoreId) {
            query += ` AND store_id != ?`;
            params.push(excludeStoreId);
        }
        const existingStore = await queryRunner.query(query, params);
        if (existingStore?.length > 0) {
            throw new common_1.HttpException(`Store already exists in this company: "${existingStore[0].store_name || existingStore[0].store_code}"`, common_1.HttpStatus.CONFLICT);
        }
    }
    async validateForeignKeys(queryRunner, companyId, groupId, merchantId) {
        if (groupId) {
            const groupExists = await queryRunner.query(`SELECT group_id FROM io_group WHERE group_id = ? AND company_id = ?`, [groupId, companyId]);
            if (!groupExists?.length) {
                throw new common_1.HttpException(`Invalid group_id: ${groupId} does not exist in company ${companyId}`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (merchantId) {
            const merchantExists = await queryRunner.query(`SELECT merchant_id FROM io_merchant WHERE merchant_id = ? AND company_id = ?`, [merchantId, companyId]);
            if (!merchantExists?.length) {
                throw new common_1.HttpException(`Invalid merchant_id: ${merchantId} does not exist in company ${companyId}`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async updateStoreWithImage(storeId, storeDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingStore = await queryRunner.query(`SELECT store_image, company_id FROM io_store WHERE store_id = ?`, [storeId]);
            if (!existingStore?.length) {
                throw new common_1.NotFoundException('Store not found');
            }
            const { company_id, group_id, merchant_id, image, ...otherFields } = storeDto;
            if (company_id) {
                await this.validateForeignKeys(queryRunner, company_id, group_id, merchant_id);
            }
            let imageFileName = existingStore[0].store_image;
            if (image) {
                const newImageFileName = await this.saveImage(image);
                if (existingStore[0].store_image && newImageFileName) {
                    await this.deleteImageFile(existingStore[0].store_image);
                }
                imageFileName = newImageFileName;
            }
            const approvalResetFields = {
                approval_status: 'reapproved',
                approve1: null,
                approve2: null,
                approved_by: null,
                approved_at: null,
                rejection_reason: null
            };
            const { sql, values } = this.buildUpdateQuery(storeId, {
                ...otherFields,
                company_id,
                group_id,
                merchant_id,
                store_image: imageFileName,
                ...approvalResetFields
            });
            if (values.length <= 2) {
                throw new common_1.HttpException('No valid fields to update', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await queryRunner.query(sql, values);
            if (result.affectedRows === 0) {
                throw new common_1.NotFoundException('Store not found or no changes made');
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Store updated successfully: ${storeId} - Approval status reset to 'reapproved'`);
            return {
                status: 'success',
                message: 'Store updated successfully. Approval status reset to reapproved.',
                data: {
                    store_id: storeId,
                    updated_fields: values.length - 2,
                    approval_status: 'reapproved'
                }
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error updating store:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update store',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    buildUpdateQuery(storeId, fields) {
        const updates = [];
        const values = [];
        const allowedFields = [
            'company_id', 'group_id', 'merchant_id', 'store_name', 'store_code',
            'store_manager', 'email', 'phone', 'address', 'city', 'state', 'country',
            'postal_code', 'store_type', 'status', 'opening_hours', 'square_footage',
            'notes', 'store_image', 'upi_percentage', 'visa_percentage',
            'master_percentage', 'account', 'account2', 'store_mode', 'web',
            'email1', 'email2', 'email3', 'email4', 'email5', 'mcc', 'account_name',
            'cif', 'approve1', 'approve2',
            'approval_status', 'approved_by', 'approved_at', 'rejection_reason'
        ];
        for (const field of allowedFields) {
            if (fields.hasOwnProperty(field)) {
                updates.push(`${field} = ?`);
                values.push(fields[field]);
            }
        }
        updates.push('updated_date = NOW()');
        values.push(storeId);
        const sql = `UPDATE io_store SET ${updates.join(', ')} WHERE store_id = ?`;
        return { sql, values };
    }
    async deleteStore(storeId) {
        try {
            const existingStore = await this.dataSource.query(`SELECT store_id, store_name, store_image FROM io_store WHERE store_id = ?`, [storeId]);
            if (!existingStore?.length) {
                throw new common_1.NotFoundException('Store not found');
            }
            if (existingStore[0].store_image) {
                await this.deleteImageFile(existingStore[0].store_image);
            }
            const result = await this.dataSource.query(`DELETE FROM io_store WHERE store_id = ?`, [storeId]);
            if (result.affectedRows === 0) {
                throw new common_1.HttpException('Failed to delete store', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            this.logger.log(`Store deleted successfully: ${existingStore[0].store_name} (ID: ${storeId})`);
            return {
                status: 'success',
                message: 'Store deleted successfully',
            };
        }
        catch (error) {
            this.logger.error('Error deleting store:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete store',
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
            return uniqueFileName;
        }
        catch (error) {
            this.logger.error('Failed to save image:', error);
            throw new common_1.HttpException(`Failed to save image: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteImageFile(fileName) {
        try {
            const imagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', fileName);
            await fs.unlink(imagePath);
            this.logger.log(`Image file deleted: ${fileName}`);
        }
        catch (error) {
            this.logger.warn(`Could not delete image file: ${error.message}`);
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
        const mimeMap = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        return mimeMap[mimeType] || 'png';
    }
    async getGroupsByCompany(companyId) {
        try {
            const groups = await this.dataSource.query(`SELECT group_id, group_name, image_url FROM io_group WHERE company_id = ? ORDER BY group_name`, [companyId]);
            return {
                status: 'success',
                message: 'Groups fetched successfully',
                data: groups,
            };
        }
        catch (error) {
            this.logger.error('Error fetching groups:', error);
            return {
                status: 'error',
                message: 'Failed to fetch groups',
                error: error.message,
            };
        }
    }
    async getMerchantsByCompanyAndGroup(companyId, groupId) {
        try {
            let query = `SELECT merchant_id, merchant_name, phone FROM io_merchant WHERE company_id = ?`;
            const params = [companyId];
            if (groupId) {
                query += ` AND group_id = ?`;
                params.push(groupId);
            }
            query += ` ORDER BY merchant_name`;
            const merchants = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Merchants fetched successfully',
                data: merchants,
            };
        }
        catch (error) {
            this.logger.error('Error fetching merchants:', error);
            return {
                status: 'error',
                message: 'Failed to fetch merchants',
                error: error.message,
            };
        }
    }
    async updateStoreApproval(storeId, approvalData) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingStore = await queryRunner.query(`SELECT store_id, store_name, approve1, approve2 FROM io_store WHERE store_id = ?`, [storeId]);
            if (!existingStore?.length) {
                throw new common_1.NotFoundException(`Store with ID ${storeId} not found`);
            }
            const validStatuses = ['pending', 'approved', 'rejected'];
            if (!validStatuses.includes(approvalData.approval_status.toLowerCase())) {
                throw new common_1.HttpException(`Invalid approval status. Must be one of: ${validStatuses.join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const mysqlDatetime = new Date(approvalData.approved_at)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            const updateFields = [
                'approval_status = ?',
                'approved_by = ?',
                'approved_at = ?',
                'updated_date = NOW()'
            ];
            const values = [
                approvalData.approval_status,
                approvalData.approved_by,
                mysqlDatetime
            ];
            if (approvalData.approve1 !== undefined) {
                updateFields.splice(3, 0, 'approve1 = ?');
                values.splice(3, 0, approvalData.approve1);
            }
            if (approvalData.approve2 !== undefined) {
                const insertIndex = approvalData.approve1 !== undefined ? 4 : 3;
                updateFields.splice(insertIndex, 0, 'approve2 = ?');
                values.splice(insertIndex, 0, approvalData.approve2);
            }
            if (approvalData.rejection_reason) {
                updateFields.splice(updateFields.length - 1, 0, 'rejection_reason = ?');
                values.splice(values.length - 1, 0, approvalData.rejection_reason);
            }
            else if (approvalData.approval_status.toLowerCase() === 'approved') {
                updateFields.splice(updateFields.length - 1, 0, 'rejection_reason = NULL');
            }
            values.push(storeId);
            const sql = `UPDATE io_store SET ${updateFields.join(', ')} WHERE store_id = ?`;
            const result = await queryRunner.query(sql, values);
            if (result.affectedRows === 0) {
                throw new common_1.NotFoundException('Store not found or no changes made');
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Store approval updated: ${existingStore[0].store_name} (ID: ${storeId}) - Status: ${approvalData.approval_status} by ${approvalData.approved_by}`);
            return {
                status: 'success',
                message: `Store ${approvalData.approval_status} successfully`,
                data: {
                    store_id: storeId,
                    store_name: existingStore[0].store_name,
                    approval_status: approvalData.approval_status,
                    approved_by: approvalData.approved_by,
                    approved_at: mysqlDatetime,
                    ...(approvalData.approve1 !== undefined && { approve1: approvalData.approve1 }),
                    ...(approvalData.approve2 !== undefined && { approve2: approvalData.approve2 }),
                    ...(approvalData.rejection_reason && { rejection_reason: approvalData.rejection_reason })
                }
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error updating store approval:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update store approval',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.IoStoreService = IoStoreService;
exports.IoStoreService = IoStoreService = IoStoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IoStoreService);
//# sourceMappingURL=iostore.service.js.map