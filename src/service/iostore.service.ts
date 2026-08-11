import { CreateIoStoreDto, UpdateIoStoreDto, IoStoreDto, FindStoreByIdDto } from 'src/dto/iostore.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

interface StoreQueryResult {
  store_id: number;
  store_name: string;
  store_code: string;
  store_image?: string;
  group_name?: string;
  merchant_name?: string;
  [key: string]: any;
}

@Injectable()
export class IoStoreService {
  private readonly logger = new Logger(IoStoreService.name);

  constructor(private dataSource: DataSource) { }

  /**
   * Find store by ID with proper error handling and type safety
   */
  async findStoreById(dto: FindStoreByIdDto): Promise<any> {
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
      const result: StoreQueryResult[] = await this.dataSource.query(query, [dto.id]);

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
    } catch (error) {
      this.logger.error('Error fetching store:', error);
      return {
        status: 'error',
        message: 'Failed to fetch store info',
        error: error.message,
      };
    }
  }

  /**
   * Find stores by status with improved query building
   */
  async findStoresByStatus(dto: IoStoreDto): Promise<any> {
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
      
      const whereConditions: string[] = [];
      const params: any[] = [];

      // Build WHERE conditions dynamically
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
      } else if (company_id) {
        // Admin with company filter
        whereConditions.push('s.company_id = ?');
        params.push(company_id);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ' ORDER BY s.store_id DESC';

      const result: StoreQueryResult[] = await this.dataSource.query(query, params);
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
    } catch (error) {
      this.logger.error('Error fetching stores by status:', error);
      return {
        status: 'error',
        message: 'Failed to fetch stores',
        error: error.message,
      };
    }
  }

  /**
   * Generate store code with improved error handling
   */
  private async generateStoreCode(companyId: number, userId?: number): Promise<string> {
    try {
      this.logger.log(`Generating store code for company_id: ${companyId}, user_id: ${userId}`);

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

    } catch (error) {
      this.logger.error('Error in generateStoreCode:', error);
      const fallbackCode = `SERR${Date.now().toString().slice(-8)}`;
      this.logger.warn(`Using emergency fallback code: ${fallbackCode}`);
      return fallbackCode;
    }
  }

  /**
   * Add store with transaction support and improved validation
   */
  async addStoreWithImage(storeDto: any): Promise<{ status: string; message: string; data?: any }> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        company_id,
        group_id,
        merchant_id,
        store_name,
        store_code: providedStoreCode,
        store_manager,
        email,
        phone,
        address,
        city,
        state,
        country,
        postal_code,
        store_type,
        status,
        opening_hours,
        square_footage,
        notes,
        image,
        upi_percentage = 0.00,
        visa_percentage = 0.00,
        master_percentage = 0.00,
        account,
        account2,
        store_mode,
        web,
        email1,
        email2,
        email3,
        email4,
        email5,
        mcc,
        account_name,
        cif,
        approve1,
        approve2,
        user_id
      } = storeDto;

      // Validate required fields
      if (!company_id || !store_name) {
        throw new HttpException(
          'Company ID and store name are required',
          HttpStatus.BAD_REQUEST
        );
      }

      // Auto-lookup user_id from phone number if not provided
      let finalUserId = user_id;
      if (!finalUserId && phone) {
        const userResult = await queryRunner.query(
          `SELECT user_id FROM io_user WHERE phone = ? AND company_id = ?`,
          [phone, company_id]
        );
        
        if (userResult?.length > 0) {
          finalUserId = userResult[0].user_id;
          this.logger.log(`Found user_id: ${finalUserId} for phone: ${phone}`);
        }
      }

      // Generate or validate store_code
      const store_code = providedStoreCode || await this.generateStoreCode(company_id, finalUserId);

      // Check for duplicate store
      await this.validateStoreUniqueness(queryRunner, store_name, store_code, company_id);

      // Validate foreign key references
      await this.validateForeignKeys(queryRunner, company_id, group_id, merchant_id);

      // Save image if provided
      const imageFileName = await this.saveImage(image);

      // Insert store record
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
        store_mode, web, email1, email2, email3, email4, email5,mcc, account_name, 
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

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating store:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create store',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Validate store uniqueness
   */
  private async validateStoreUniqueness(
    queryRunner: QueryRunner, 
    storeName: string, 
    storeCode: string, 
    companyId: number,
    excludeStoreId?: number
  ): Promise<void> {
    let query = `SELECT store_name, store_code FROM io_store 
                 WHERE (store_name = ? OR store_code = ?) AND company_id = ?`;
    const params = [storeName, storeCode, companyId];

    // Exclude current store when updating
    if (excludeStoreId) {
      query += ` AND store_id != ?`;
      params.push(excludeStoreId);
    }

    const existingStore = await queryRunner.query(query, params);

    if (existingStore?.length > 0) {
      throw new HttpException(
        `Store already exists in this company: "${existingStore[0].store_name || existingStore[0].store_code}"`,
        HttpStatus.CONFLICT
      );
    }
  }

  /**
   * Validate foreign key references
   */
  private async validateForeignKeys(
    queryRunner: QueryRunner,
    companyId: number,
    groupId?: number,
    merchantId?: number
  ): Promise<void> {
    if (groupId) {
      const groupExists = await queryRunner.query(
        `SELECT group_id FROM io_group WHERE group_id = ? AND company_id = ?`,
        [groupId, companyId]
      );
      if (!groupExists?.length) {
        throw new HttpException(
          `Invalid group_id: ${groupId} does not exist in company ${companyId}`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (merchantId) {
      const merchantExists = await queryRunner.query(
        `SELECT merchant_id FROM io_merchant WHERE merchant_id = ? AND company_id = ?`,
        [merchantId, companyId]
      );
      if (!merchantExists?.length) {
        throw new HttpException(
          `Invalid merchant_id: ${merchantId} does not exist in company ${companyId}`,
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  /**
   * Update store with transaction support
   */
  async updateStoreWithImage(
  storeId: number,
  storeDto: any,
): Promise<{ status: string; message: string; data?: any }> {
  const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const existingStore = await queryRunner.query(
      `SELECT store_image, company_id FROM io_store WHERE store_id = ?`,
      [storeId]
    );

    if (!existingStore?.length) {
      throw new NotFoundException('Store not found');
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

    // **ADD THIS: Automatically reset approval when store is updated**
    const approvalResetFields = {
      approval_status: 'reapproved',  // Set to 'reapproved' status
      approve1: null,                  // Clear first approver
      approve2: null,                  // Clear second approver
      approved_by: null,               // Clear approved_by
      approved_at: null,               // Clear approval timestamp
      rejection_reason: null           // Clear rejection reason
    };

    // Build dynamic update query with approval reset
    const { sql, values } = this.buildUpdateQuery(storeId, { 
      ...otherFields, 
      company_id, 
      group_id, 
      merchant_id, 
      store_image: imageFileName,
      ...approvalResetFields  // **ADD THIS LINE**
    });

    if (values.length <= 2) {
      throw new HttpException('No valid fields to update', HttpStatus.BAD_REQUEST);
    }

    const result = await queryRunner.query(sql, values);
    
    if (result.affectedRows === 0) {
      throw new NotFoundException('Store not found or no changes made');
    }

    await queryRunner.commitTransaction();

    this.logger.log(`Store updated successfully: ${storeId} - Approval status reset to 'reapproved'`);
    return {
      status: 'success',
      message: 'Store updated successfully. Approval status reset to reapproved.',
      data: { 
        store_id: storeId, 
        updated_fields: values.length - 2,
        approval_status: 'reapproved'  // Inform client about approval reset
      }
    };

  } catch (error) {
    await queryRunner.rollbackTransaction();
    this.logger.error('Error updating store:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to update store',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } finally {
    await queryRunner.release();
  }
}
  /**
   * Build dynamic update query
   */
 private buildUpdateQuery(storeId: number, fields: any): { sql: string; values: any[] } {
  const updates: string[] = [];
  const values: any[] = [];

  const allowedFields = [
    'company_id', 'group_id', 'merchant_id', 'store_name', 'store_code', 
    'store_manager', 'email', 'phone', 'address', 'city', 'state', 'country', 
    'postal_code', 'store_type', 'status', 'opening_hours', 'square_footage', 
    'notes', 'store_image', 'upi_percentage', 'visa_percentage', 
    'master_percentage', 'account', 'account2', 'store_mode', 'web', 
    'email1', 'email2', 'email3', 'email4', 'email5', 'mcc', 'account_name', 
    'cif', 'approve1', 'approve2',
    // **ADD THESE APPROVAL FIELDS:**
    'approval_status', 'approved_by', 'approved_at', 'rejection_reason'
  ];

  for (const field of allowedFields) {
    if (fields.hasOwnProperty(field)) {  // Changed to check hasOwnProperty to allow null values
      updates.push(`${field} = ?`);
      values.push(fields[field]);
    }
  }

  updates.push('updated_date = NOW()');
  values.push(storeId);

  const sql = `UPDATE io_store SET ${updates.join(', ')} WHERE store_id = ?`;
  return { sql, values };
}

  /**
   * Delete store with proper cleanup
   */
  async deleteStore(storeId: number): Promise<{ status: string; message: string }> {
    try {
      const existingStore = await this.dataSource.query(
        `SELECT store_id, store_name, store_image FROM io_store WHERE store_id = ?`,
        [storeId]
      );

      if (!existingStore?.length) {
        throw new NotFoundException('Store not found');
      }

      // Delete associated image file if exists
      if (existingStore[0].store_image) {
        await this.deleteImageFile(existingStore[0].store_image);
      }

      // Delete from database
      const result = await this.dataSource.query(
        `DELETE FROM io_store WHERE store_id = ?`,
        [storeId]
      );

      if (result.affectedRows === 0) {
        throw new HttpException('Failed to delete store', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      this.logger.log(`Store deleted successfully: ${existingStore[0].store_name} (ID: ${storeId})`);
      return {
        status: 'success',
        message: 'Store deleted successfully',
      };

    } catch (error) {
      this.logger.error('Error deleting store:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete store',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Save image with improved error handling
   */
  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'iouser');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueFileName);

      // Write the base64 data directly as a string with base64 encoding
      await fs.writeFile(filePath, data, 'base64');
      return uniqueFileName;
    } catch (error) {
      this.logger.error('Failed to save image:', error);
      throw new HttpException(
        `Failed to save image: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete image file
   */
  private async deleteImageFile(fileName: string): Promise<void> {
    try {
      const imagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', fileName);
      await fs.unlink(imagePath);
      this.logger.log(`Image file deleted: ${fileName}`);
    } catch (error) {
      this.logger.warn(`Could not delete image file: ${error.message}`);
      // Don't fail the entire operation if image deletion fails
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
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    return mimeMap[mimeType] || 'png';
  }

  /**
   * Get groups by company
   */
  async getGroupsByCompany(companyId: number): Promise<any> {
    try {
      const groups = await this.dataSource.query(
        `SELECT group_id, group_name, image_url FROM io_group WHERE company_id = ? ORDER BY group_name`,
        [companyId]
      );

      return {
        status: 'success',
        message: 'Groups fetched successfully',
        data: groups,
      };
    } catch (error) {
      this.logger.error('Error fetching groups:', error);
      return {
        status: 'error',
        message: 'Failed to fetch groups',
        error: error.message,
      };
    }
  }

  /**
   * Get merchants by company and optionally by group
   */
  async getMerchantsByCompanyAndGroup(companyId: number, groupId?: number): Promise<any> {
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
    } catch (error) {
      this.logger.error('Error fetching merchants:', error);
      return {
        status: 'error',
        message: 'Failed to fetch merchants',
        error: error.message,
      };
    }
  }

async updateStoreApproval(
  storeId: number,
  approvalData: {
    approval_status: string;
    approved_by: string;
    approved_at: string;
    rejection_reason?: string;
    approve1?: string;
    approve2?: string;
  },
): Promise<{ status: string; message: string; data?: any }> {
  const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const existingStore = await queryRunner.query(
      `SELECT store_id, store_name, approve1, approve2 FROM io_store WHERE store_id = ?`,
      [storeId]
    );

    if (!existingStore?.length) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(approvalData.approval_status.toLowerCase())) {
      throw new HttpException(
        `Invalid approval status. Must be one of: ${validStatuses.join(', ')}`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Convert ISO 8601 to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
    const mysqlDatetime = new Date(approvalData.approved_at)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const updateFields: string[] = [
      'approval_status = ?',
      'approved_by = ?',
      'approved_at = ?',
      'updated_date = NOW()'
    ];
    
    const values: any[] = [
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
    } else if (approvalData.approval_status.toLowerCase() === 'approved') {
      updateFields.splice(updateFields.length - 1, 0, 'rejection_reason = NULL');
    }

    values.push(storeId);

    const sql = `UPDATE io_store SET ${updateFields.join(', ')} WHERE store_id = ?`;
    const result = await queryRunner.query(sql, values);

    if (result.affectedRows === 0) {
      throw new NotFoundException('Store not found or no changes made');
    }

    await queryRunner.commitTransaction();

    this.logger.log(
      `Store approval updated: ${existingStore[0].store_name} (ID: ${storeId}) - Status: ${approvalData.approval_status} by ${approvalData.approved_by}`
    );

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

  } catch (error) {
    await queryRunner.rollbackTransaction();
    this.logger.error('Error updating store approval:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to update store approval',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } finally {
    await queryRunner.release();
  }
}
}