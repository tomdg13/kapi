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
exports.IoCompanyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let IoCompanyService = class IoCompanyService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findCompanyById(dto) {
        try {
            const query = `SELECT * FROM io_company WHERE company_id = ?`;
            const result = await this.dataSource.query(query, [dto.id]);
            if (result.length === 0) {
                return {
                    status: 'not_found',
                    message: `Company with ID ${dto.id} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const companyWithImageUrls = result.map((company) => ({
                ...company,
                image_url: company.company_image ? imageBaseUrl + company.company_image : null,
                logo_full_url: company.logo_url ? imageBaseUrl + company.logo_url : null,
            }));
            return {
                status: 'success',
                message: 'Company fetched successfully',
                data: companyWithImageUrls,
            };
        }
        catch (error) {
            console.error('Error fetching company:', error);
            return {
                status: 'error',
                message: 'Failed to fetch company info',
                error: error.message,
            };
        }
    }
    async findCompanysByStatus(dto) {
        try {
            let query;
            let params = [];
            if (dto.status?.toLowerCase() === 'admin') {
                if (dto.company_id) {
                    query = `SELECT * FROM io_company WHERE company_id = ?`;
                    params.push(dto.company_id);
                }
                else {
                    query = `SELECT * FROM io_company`;
                }
            }
            else {
                if (dto.company_id) {
                    query = `SELECT * FROM io_company WHERE company_id = ?`;
                    params.push(dto.company_id);
                }
                else {
                    query = `SELECT * FROM io_company`;
                }
            }
            if (dto.search) {
                if (params.length > 0) {
                    query += ` AND (company_name LIKE ? OR company_code LIKE ? OR ceo_name LIKE ? OR phone LIKE ? OR email LIKE ?)`;
                }
                else {
                    query += ` WHERE (company_name LIKE ? OR company_code LIKE ? OR ceo_name LIKE ? OR phone LIKE ? OR email LIKE ?)`;
                }
                const searchTerm = `%${dto.search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }
            if (dto.sort_by) {
                const sortOrder = dto.sort_order || 'ASC';
                query += ` ORDER BY ${dto.sort_by} ${sortOrder}`;
            }
            else {
                query += ` ORDER BY created_at DESC`;
            }
            if (dto.limit) {
                const offset = dto.page ? (dto.page - 1) * dto.limit : 0;
                query += ` LIMIT ? OFFSET ?`;
                params.push(dto.limit, offset);
            }
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const companysWithImageUrls = result.map((company) => ({
                ...company,
                image_url: company.company_image ? imageBaseUrl + company.company_image : null,
                logo_full_url: company.logo_url ? imageBaseUrl + company.logo_url : null,
            }));
            return {
                status: 'success',
                message: dto.status?.toLowerCase() === 'admin'
                    ? `All companys fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
                    : `Companys${dto.company_id ? ` for company ${dto.company_id}` : ''} fetched`,
                data: companysWithImageUrls,
                pagination: dto.limit ? {
                    page: dto.page || 1,
                    limit: dto.limit,
                    total: result.length
                } : undefined
            };
        }
        catch (error) {
            console.error('Error fetching companys by status:', error);
            return {
                status: 'error',
                message: 'Failed to fetch companys',
                error: error.message,
            };
        }
    }
    async generateCompanyCode(companyId, userId) {
        try {
            console.log(`🔍 Generating company code for company_id: ${companyId}, user_id: ${userId}`);
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
            MAX(CAST(RIGHT(company_code, 4) AS UNSIGNED)), 0
          ) + 1 as next_sequence
        FROM io_company 
        WHERE company_id = ? 
        AND company_code LIKE ?
      `;
            const sequenceResult = await this.dataSource.query(sequenceQuery, [
                companyId,
                `${prefix}%`
            ]);
            console.log('📊 Sequence query result:', sequenceResult);
            const nextSequence = sequenceResult[0]?.next_sequence || 1;
            const paddedSequence = String(nextSequence).padStart(4, '0');
            const generatedCode = `${prefix}${paddedSequence}`;
            console.log(`✅ Generated CONTINUOUS company_code: ${generatedCode} for company ${companyId}`);
            return generatedCode;
        }
        catch (error) {
            console.error('❌ Error in generateCompanyCode:', error);
            const fallbackCode = `GERR${Date.now().toString().slice(-4)}`;
            console.log(`🆘 Using emergency fallback code: ${fallbackCode}`);
            return fallbackCode;
        }
    }
    async addCompanyWithImage(companyDto) {
        try {
            const { company_id, company_name, company_name_en, business_type, tax_id, address, phone, email, website, ceo_name, employee_count, established_year, company_code, image, logo, user_id } = companyDto;
            console.log(`Adding company with company_name: ${company_name}, company_id: ${company_id}, phone: ${phone}`);
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
            const autoGeneratedCompanyCode = await this.generateCompanyCode(company_id, finalUserId);
            if (company_name) {
                const existingCompanyQuery = `
          SELECT company_name, company_code, tax_id
          FROM io_company 
          WHERE company_name = ? OR (tax_id IS NOT NULL AND tax_id = ?)
        `;
                const queryParams = [company_name, tax_id];
                const existingCompanys = await this.dataSource.query(existingCompanyQuery, queryParams);
                if (existingCompanys && existingCompanys.length > 0) {
                    const existingCompany = existingCompanys[0];
                    console.log(`Found existing company:`, existingCompany);
                    console.log(`❌ REJECTING: Company already exists`);
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Company already exists`,
                        details: `Existing company "${existingCompany.company_name}" with tax_id "${existingCompany.tax_id}"`,
                    }, common_1.HttpStatus.CONFLICT);
                }
                else {
                    console.log(`✅ ALLOWING: No existing company with same name or tax_id`);
                }
            }
            const imageFileName = await this.saveImage(image);
            const logoFileName = await this.saveImage(logo);
            const sql = `
        INSERT INTO io_company (
          company_name, company_code, company_name_en, business_type, tax_id,
          address, phone, email, website, logo_url, ceo_name, 
          employee_count, established_year, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `;
            const values = [
                company_name,
                autoGeneratedCompanyCode,
                company_name_en,
                business_type,
                tax_id,
                address,
                phone,
                email,
                website,
                logoFileName,
                ceo_name,
                employee_count,
                established_year
            ];
            console.log('Executing SQL with values:', values);
            const result = await this.dataSource.query(sql, values);
            const createdCompany = await this.dataSource.query(`SELECT * FROM io_company WHERE company_id = ?`, [result.insertId]);
            console.log(`✅ Company created successfully: ${company_name} with code ${autoGeneratedCompanyCode}`);
            return {
                status: 'success',
                message: `Company created successfully with auto-generated code: ${autoGeneratedCompanyCode}`,
                data: {
                    company_id: result.insertId,
                    company_code: autoGeneratedCompanyCode,
                    logo_url: logoFileName,
                    ...createdCompany[0]
                }
            };
        }
        catch (error) {
            console.error('Error creating company:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create company',
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
    async updateCompanyWithImage(companyId, companyDto) {
        try {
            console.log('📝 Received companyDto:', JSON.stringify(companyDto, null, 2));
            const { company_name, company_name_en, business_type, tax_id, address, phone, email, website, ceo_name, employee_count, established_year, company_code, image, logo, status } = companyDto;
            const [existingCompany] = await this.dataSource.query(`SELECT * FROM io_company WHERE company_id = ?`, [companyId]);
            if (!existingCompany) {
                throw new common_1.NotFoundException('Company not found');
            }
            let logoFileName = existingCompany.logo_url;
            if (logo) {
                if (existingCompany.logo_url) {
                    try {
                        const oldLogoPath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingCompany.logo_url);
                        await fs.unlink(oldLogoPath);
                        console.log(`🗑️ Old logo deleted: ${existingCompany.logo_url}`);
                    }
                    catch (logoError) {
                        console.warn(`⚠️ Could not delete old logo: ${logoError.message}`);
                    }
                }
                logoFileName = await this.saveImage(logo);
            }
            let imageFileName = existingCompany.company_image;
            if (image) {
                if (existingCompany.company_image) {
                    try {
                        const oldImagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingCompany.company_image);
                        await fs.unlink(oldImagePath);
                        console.log(`🗑️ Old image deleted: ${existingCompany.company_image}`);
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
            addField('company_name', company_name);
            addField('company_name_en', company_name_en);
            addField('business_type', business_type);
            addField('tax_id', tax_id);
            addField('address', address);
            addField('phone', phone);
            addField('email', email);
            addField('website', website);
            addField('logo_url', logoFileName);
            addField('company_image', imageFileName);
            addField('ceo_name', ceo_name);
            addField('employee_count', employee_count);
            addField('established_year', established_year);
            addField('company_code', company_code);
            addField('status', status);
            updates.push('updated_at = CURRENT_TIMESTAMP');
            if (updates.length <= 1) {
                throw new Error('No valid fields to update');
            }
            values.push(companyId);
            const sql = `
      UPDATE io_company SET
        ${updates.join(', ')}
      WHERE company_id = ?
    `;
            console.log('🧾 Executing SQL:\n', sql);
            console.log('📦 With values:', values);
            const result = await this.dataSource.query(sql, values);
            if (result.affectedRows === 0) {
                throw new common_1.NotFoundException('Company not found or no changes made');
            }
            const [updatedCompany] = await this.dataSource.query(`SELECT * FROM io_company WHERE company_id = ?`, [companyId]);
            console.log('✅ Company update complete for company_id:', companyId);
            return {
                status: 'success',
                message: 'Company updated successfully',
                data: updatedCompany
            };
        }
        catch (error) {
            console.error('❌ Error updating company:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCompany(companyId) {
        try {
            const [existingCompany] = await this.dataSource.query(`SELECT company_id, company_name, company_image, logo_url FROM io_company WHERE company_id = ?`, [companyId]);
            if (!existingCompany) {
                throw new common_1.NotFoundException('Company not found');
            }
            const imagesToDelete = [existingCompany.company_image, existingCompany.logo_url].filter(Boolean);
            for (const imageFileName of imagesToDelete) {
                try {
                    const imagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', imageFileName);
                    await fs.unlink(imagePath);
                    console.log(`🗑️ Image file deleted: ${imageFileName}`);
                }
                catch (imageError) {
                    console.warn(`⚠️ Could not delete image file ${imageFileName}: ${imageError.message}`);
                }
            }
            const sql = `DELETE FROM io_company WHERE company_id = ?`;
            const result = await this.dataSource.query(sql, [companyId]);
            if (result.affectedRows === 0) {
                throw new Error('Failed to delete company');
            }
            console.log(`✅ Company deleted successfully: ${existingCompany.company_name} (ID: ${companyId})`);
            return {
                status: 'success',
                message: 'Company deleted successfully',
            };
        }
        catch (error) {
            console.error('❌ Error deleting company:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCompanyStats(companyId) {
        try {
            let query = `
        SELECT 
          COUNT(*) as total_companys,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_companys,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_companys,
          COUNT(CASE WHEN logo_url IS NOT NULL THEN 1 END) as companys_with_logos,
          COUNT(CASE WHEN website IS NOT NULL THEN 1 END) as companys_with_websites,
          COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as companys_with_emails
        FROM io_company
      `;
            const params = [];
            if (companyId) {
                query += ` WHERE company_id = ?`;
                params.push(companyId);
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Company statistics fetched successfully',
                data: result[0]
            };
        }
        catch (error) {
            console.error('Error fetching company stats:', error);
            return {
                status: 'error',
                message: 'Failed to fetch company statistics',
                error: error.message,
            };
        }
    }
};
exports.IoCompanyService = IoCompanyService;
exports.IoCompanyService = IoCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IoCompanyService);
//# sourceMappingURL=iocompany.service.js.map