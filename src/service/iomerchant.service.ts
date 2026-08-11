import { CreateIomerchantDto, UpdateIomerchantDto, IomerchantDto, FindMerchantByIdDto } from 'src/dto/iomerchant.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class IoMerchantService {
  constructor(private dataSource: DataSource) {}

  async findMerchantById(dto: FindMerchantByIdDto): Promise<any> {
    try {
      const query = `SELECT * FROM io_merchant WHERE merchant_id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `Merchant with ID ${dto.id} not found`,
          data: [],
        };
      }

      // Add full image URL if merchant_image exists
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
      const merchantWithImageUrl = result.map((merchant: any) => ({
        ...merchant,
        image_url: merchant.merchant_image ? imageBaseUrl + merchant.merchant_image : null,
      }));

      return {
        status: 'success',
        message: 'Merchant fetched successfully',
        data: merchantWithImageUrl,
      };
    } catch (error) {
      console.error('Error fetching merchant:', error);
      return {
        status: 'error',
        message: 'Failed to fetch merchant info',
        error: error.message,
      };
    }
  }

  async findMerchantsByStatus(dto: IomerchantDto): Promise<any> {
    try {
      let query: string;
      let params: any[] = [];

      if (dto.status?.toLowerCase() === 'admin') {
        // Admin: show all merchants, but filter by company_id if provided
        if (dto.company_id) {
          query = `SELECT * FROM io_merchant WHERE company_id = ?`;
          params.push(dto.company_id);
        } else {
          query = `SELECT * FROM io_merchant`;
        }
      } else {
        // Non-admin: filter by company_id (io_merchant doesn't have status field)
        if (dto.company_id) {
          query = `SELECT * FROM io_merchant WHERE company_id = ?`;
          params.push(dto.company_id);
        } else {
          query = `SELECT * FROM io_merchant`;
        }
      }

      // Add search functionality
      if (dto.search) {
        if (params.length > 0) {
          query += ` AND (merchant_name LIKE ? OR merchant_code LIKE ? OR merchant_manager LIKE ?)`;
        } else {
          query += ` WHERE (merchant_name LIKE ? OR merchant_code LIKE ? OR merchant_manager LIKE ?)`;
        }
        const searchTerm = `%${dto.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Add sorting
      if (dto.sort_by) {
        const sortOrder = dto.sort_order || 'ASC';
        query += ` ORDER BY ${dto.sort_by} ${sortOrder}`;
      } else {
        query += ` ORDER BY created_date DESC`;
      }

      // Add pagination
      if (dto.limit) {
        const offset = dto.page ? (dto.page - 1) * dto.limit : 0;
        query += ` LIMIT ? OFFSET ?`;
        params.push(dto.limit, offset);
      }

      const result = await this.dataSource.query(query, params);

      // Base URL where images are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

      // Append full image URLs
      const merchantsWithImageUrls = result.map((merchant: any) => ({
        ...merchant,
        image_url: merchant.merchant_image ? imageBaseUrl + merchant.merchant_image : null,
      }));

      return {
        status: 'success',
        message: dto.status?.toLowerCase() === 'admin'
          ? `All merchants fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
          : `Merchants${dto.company_id ? ` for company ${dto.company_id}` : ''} fetched`,
        data: merchantsWithImageUrls,
        pagination: dto.limit ? {
          page: dto.page || 1,
          limit: dto.limit,
          total: result.length
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching merchants by status:', error);
      return {
        status: 'error',
        message: 'Failed to fetch merchants',
        error: error.message,
      };
    }
  }

  // Updated method to auto-generate merchant code with CONTINUOUS sequence
  private async generateMerchantCode(companyId: number, userId?: number): Promise<string> {
    try {
      console.log(`🔍 Generating merchant code for company_id: ${companyId}, user_id: ${userId}`);

      // First, get branch info
      let branchQuery: string;
      let branchParams: any[];

      if (userId) {
        branchQuery = `
          SELECT b.branch_code, b.branch_name
          FROM io_user u
          LEFT JOIN io_branch b ON u.branch_id = b.branch_id
          WHERE u.company_id = ? AND u.user_id = ?
        `;
        branchParams = [companyId, userId];
      } else {
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
      const prefix = `M${branch_code}${branch_name}`;

      // Get the next CONTINUOUS sequence number by finding max sequence in existing merchant_codes
      const sequenceQuery = `
        SELECT 
          IFNULL(
            MAX(CAST(RIGHT(merchant_code, 8) AS UNSIGNED)), 0
          ) + 1 as next_sequence
        FROM io_merchant 
        WHERE company_id = ? 
        AND merchant_code LIKE ?
      `;

      const sequenceResult = await this.dataSource.query(sequenceQuery, [
        companyId, 
        `${prefix}%`
      ]);

      console.log('📊 Sequence query result:', sequenceResult);

      const nextSequence = sequenceResult[0]?.next_sequence || 1;
      const paddedSequence = String(nextSequence).padStart(8, '0');
      const generatedCode = `${prefix}${paddedSequence}`;

      console.log(`✅ Generated CONTINUOUS merchant_code: ${generatedCode} for company ${companyId}`);
      return generatedCode;

    } catch (error) {
      console.error('❌ Error in generateMerchantCode:', error);
      
      // Ultimate fallback - use timestamp
      const fallbackCode = `GERR${Date.now().toString().slice(-4)}`;
      console.log(`🆘 Using emergency fallback code: ${fallbackCode}`);
      return fallbackCode;
    }
  }

  async addMerchantWithImage(merchantDto: any): Promise<{ status: string; message: string; data?: any }> {
    try {
      const {
        company_id,
        merchant_name,
        merchant_code, // This will be ignored - we'll auto-generate
        phone,
        image,
        user_id, // Optional user_id for more specific merchant code generation
        group_id = 1 // Default to group_id = 1 if not provided
      } = merchantDto;

      console.log(`Adding merchant with merchant_name: ${merchant_name}, company_id: ${company_id}, phone: ${phone}, group_id: ${group_id}`);

      // Auto-lookup user_id from phone number if not provided
      let finalUserId = user_id;
      if (!finalUserId && phone) {
        console.log(`Looking up user_id for phone: ${phone} in company: ${company_id}`);
        const userLookupQuery = `SELECT user_id FROM io_user WHERE phone = ? AND company_id = ?`;
        const userResult = await this.dataSource.query(userLookupQuery, [phone, company_id]);
        
        if (userResult && userResult.length > 0) {
          finalUserId = userResult[0].user_id;
          console.log(`Found user_id: ${finalUserId} for phone: ${phone}`);
        } else {
          console.log(`No user found for phone: ${phone} in company: ${company_id}`);
        }
      }

      // Auto-generate merchant_code (with finalUserId if available)
      const autoGeneratedMerchantCode = await this.generateMerchantCode(company_id, finalUserId);

      // MERCHANT VALIDATION
      // Check if merchant already exists in the same company (by merchant_name)
      if (merchant_name && company_id) {
        const existingMerchantQuery = `
          SELECT merchant_name, merchant_code, company_id 
          FROM io_merchant 
          WHERE merchant_name = ? AND company_id = ?
        `;
        const queryParams = [merchant_name, company_id];

        const existingMerchants = await this.dataSource.query(existingMerchantQuery, queryParams);

        if (existingMerchants && existingMerchants.length > 0) {
          const existingMerchant = existingMerchants[0];
          console.log(`Found existing merchant:`, existingMerchant);

          console.log(`❌ REJECTING: Merchant already exists in company ${company_id}`);
          throw new HttpException(
            {
              status: 'error',
              message: `Merchant already exists in this company`,
              details: `Existing merchant "${existingMerchant.merchant_name}"`,
            },
            HttpStatus.CONFLICT, // 409 Conflict
          );
        } else {
          console.log(`✅ ALLOWING: No existing merchant with same name in company ${company_id}`);
        }
      }

      // Save image if provided
      const imageFileName = await this.saveImage(image);

      // Use parameterized query to prevent SQL injection - INCLUDING group_id
      const sql = `
        INSERT INTO io_merchant (
          group_id, company_id, merchant_name, merchant_code, phone, merchant_image, create_by, created_date, updated_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
        group_id,        // Add group_id as first parameter
        company_id,
        merchant_name,
        autoGeneratedMerchantCode, // Use auto-generated code
        phone,
        imageFileName,
        finalUserId // Use the looked-up or provided user_id
      ];

      console.log('Executing SQL with values:', values);
      const result = await this.dataSource.query(sql, values);

      // Get the created merchant for response
      const createdMerchant = await this.dataSource.query(
        `SELECT * FROM io_merchant WHERE merchant_id = ?`,
        [result.insertId]
      );

      console.log(`✅ Merchant created successfully: ${merchant_name} with code ${autoGeneratedMerchantCode} in company ${company_id}, group ${group_id}`);
      return {
        status: 'success',
        message: `Merchant created successfully with auto-generated code: ${autoGeneratedMerchantCode}`,
        data: {
          merchant_id: result.insertId,
          merchant_code: autoGeneratedMerchantCode,
          user_id: finalUserId,
          group_id: group_id,
          ...createdMerchant[0]
        }
      };
    } catch (error) {
      console.error('Error creating merchant:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Otherwise, wrap in generic error
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;
    
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
    } catch (error) {
      console.error('❌ Error saving image:', error);
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
      'image/bmp': 'bmp',
      'image/tiff': 'tiff'
    };
    return map[mimeType] || 'png';
  }

  async updateMerchantWithImage(
    merchantId: number,
    merchantDto: any,
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
      console.log('📝 Received merchantDto:', JSON.stringify(merchantDto, null, 2));

      const {
        group_id,
        company_id,
        merchant_name,
        merchant_code,
        phone,
        image,
        user_id,
        merchant_manager,
        email,
        address,
        city,
        state,
        country,
        postal_code,
        merchant_type,
        status,
        opening_hours,
        square_footage,
        notes,
        upi_percentage,
        visa_percentage,
        master_percentage,
        account
      } = merchantDto;

      // Find existing merchant
      const [existingMerchant] = await this.dataSource.query(
        `SELECT * FROM io_merchant WHERE merchant_id = ?`,
        [merchantId],
      );
      
      if (!existingMerchant) {
        throw new NotFoundException('Merchant not found');
      }

      // Handle image: use new image if provided, else keep existing one
      let imageFileName = existingMerchant.merchant_image;
      if (image) {
        // Delete old image if it exists
        if (existingMerchant.merchant_image) {
          try {
            const oldImagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingMerchant.merchant_image);
            await fs.unlink(oldImagePath);
            console.log(`🗑️ Old image deleted: ${existingMerchant.merchant_image}`);
          } catch (imageError) {
            console.warn(`⚠️ Could not delete old image: ${imageError.message}`);
          }
        }
        // Save new image
        imageFileName = await this.saveImage(image);
      }

      // Prepare fields to update dynamically - ONLY existing columns
      const updates: string[] = [];
      const values: any[] = [];

      // Helper to add field only if value is not null or undefined
      const addField = (fieldName: string, value: any) => {
        if (value !== null && value !== undefined) {
          updates.push(`${fieldName} = ?`);
          values.push(value);
        }
      };

      // Only update columns that exist in your database
      addField('group_id', group_id);
      addField('company_id', company_id);
      addField('merchant_name', merchant_name);
      addField('merchant_code', merchant_code);
      addField('phone', phone);
      addField('merchant_image', imageFileName);

      // Always update the updated_date
      updates.push('updated_date = NOW()');

      if (updates.length <= 1) { // Only updated_date
        throw new Error('No valid fields to update');
      }

      // Add WHERE condition value
      values.push(merchantId);

      const sql = `
        UPDATE io_merchant SET
          ${updates.join(', ')}
        WHERE merchant_id = ?
      `;

      console.log('🧾 Executing SQL:\n', sql);
      console.log('📦 With values:', values);

      const result = await this.dataSource.query(sql, values);
      
      if (result.affectedRows === 0) {
        throw new NotFoundException('Merchant not found or no changes made');
      }

      // Get updated merchant for response
      const [updatedMerchant] = await this.dataSource.query(
        `SELECT * FROM io_merchant WHERE merchant_id = ?`,
        [merchantId],
      );

      console.log('✅ Merchant update complete for merchant_id:', merchantId);
      return {
        status: 'success',
        message: 'Merchant updated successfully',
        data: updatedMerchant
      };
    } catch (error) {
      console.error('❌ Error updating merchant:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMerchant(merchantId: number): Promise<{ status: string; message: string }> {
    try {
      // Check if merchant exists and get image filename for cleanup
      const [existingMerchant] = await this.dataSource.query(
        `SELECT merchant_id, merchant_name, merchant_image FROM io_merchant WHERE merchant_id = ?`,
        [merchantId],
      );
      
      if (!existingMerchant) {
        throw new NotFoundException('Merchant not found');
      }

      // Delete associated image file if exists
      if (existingMerchant.merchant_image) {
        try {
          const imagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingMerchant.merchant_image);
          await fs.unlink(imagePath);
          console.log(`🗑️ Image file deleted: ${existingMerchant.merchant_image}`);
        } catch (imageError) {
          console.warn(`⚠️ Could not delete image file: ${imageError.message}`);
          // Don't fail the entire operation if image deletion fails
        }
      }

      // Hard delete from database
      const sql = `DELETE FROM io_merchant WHERE merchant_id = ?`;

      const result = await this.dataSource.query(sql, [merchantId]);
      
      if (result.affectedRows === 0) {
        throw new Error('Failed to delete merchant');
      }

      console.log(`✅ Merchant deleted successfully: ${existingMerchant.merchant_name} (ID: ${merchantId})`);
      return {
        status: 'success',
        message: 'Merchant deleted successfully',
      };
    } catch (error) {
      console.error('❌ Error deleting merchant:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Additional utility method to get merchant statistics
  async getMerchantStats(companyId?: number): Promise<any> {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_merchants,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_merchants,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_merchants,
          COUNT(CASE WHEN merchant_image IS NOT NULL THEN 1 END) as merchants_with_images
        FROM io_merchant
      `;
      
      const params: any[] = [];
      
      if (companyId) {
        query += ` WHERE company_id = ?`;
        params.push(companyId);
      }

      const result = await this.dataSource.query(query, params);
      
      return {
        status: 'success',
        message: 'Merchant statistics fetched successfully',
        data: result[0]
      };
    } catch (error) {
      console.error('Error fetching merchant stats:', error);
      return {
        status: 'error',
        message: 'Failed to fetch merchant statistics',
        error: error.message,
      };
    }
  }

  async checkMerchantCodeExists(merchantCode: string, companyId?: number): Promise<boolean> {
    let query = `SELECT COUNT(*) as count FROM io_merchant WHERE merchant_code = ?`;
    const params: any[] = [merchantCode];
    
    if (companyId) {
      query += ` AND company_id = ?`;
      params.push(companyId.toString()); // Convert to string
    }
    
    const result = await this.dataSource.query(query, params);
    return result[0].count > 0;
  }

  async findMerchantsByCompanyAndGroup(companyId: number, groupId: number): Promise<any> {
  try {
    const query = `SELECT * FROM io_merchant WHERE company_id = ? AND group_id = ?`;
    const result = await this.dataSource.query(query, [companyId, groupId]);

    // Base URL where images are hosted
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

    // Append full image URLs
    const merchantsWithImageUrls = result.map((merchant: any) => ({
      ...merchant,
      image_url: merchant.merchant_image ? imageBaseUrl + merchant.merchant_image : null,
    }));

    return {
      status: 'success',
      message: `Merchants fetched for company ${companyId} and group ${groupId}`,
      data: merchantsWithImageUrls,
    };
  } catch (error) {
    console.error('Error fetching merchants by company and group:', error);
    return {
      status: 'error',
      message: 'Failed to fetch merchants',
      error: error.message,
    };
  }
}
}