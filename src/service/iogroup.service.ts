import { CreateIogroupDto, UpdateIogroupDto, IogroupDto, FindGroupByIdDto } from 'src/dto/iogroup.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class IoGroupService {
  constructor(private dataSource: DataSource) {}

  async findGroupById(dto: FindGroupByIdDto): Promise<any> {
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

      // Add full image URL if group_image exists
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
      const groupWithImageUrl = result.map((group: any) => ({
        ...group,
        image_url: group.group_image ? imageBaseUrl + group.group_image : null,
      }));

      return {
        status: 'success',
        message: 'Group fetched successfully',
        data: groupWithImageUrl,
      };
    } catch (error) {
      console.error('Error fetching group:', error);
      return {
        status: 'error',
        message: 'Failed to fetch group info',
        error: error.message,
      };
    }
  }

  async findGroupsByStatus(dto: IogroupDto): Promise<any> {
    try {
      let query: string;
      let params: any[] = [];

      if (dto.status?.toLowerCase() === 'admin') {
        // Admin: show all groups, but filter by company_id if provided
        if (dto.company_id) {
          query = `SELECT * FROM io_group WHERE company_id = ?`;
          params.push(dto.company_id);
        } else {
          query = `SELECT * FROM io_group`;
        }
      } else {
        // Non-admin: filter by company_id (io_group doesn't have status field)
        if (dto.company_id) {
          query = `SELECT * FROM io_group WHERE company_id = ?`;
          params.push(dto.company_id);
        } else {
          query = `SELECT * FROM io_group`;
        }
      }

      // Add search functionality - now includes mobile
      if (dto.search) {
        if (params.length > 0) {
          query += ` AND (group_name LIKE ? OR group_code LIKE ? OR group_manager LIKE ? OR phone LIKE ? OR mobile LIKE ?)`;
        } else {
          query += ` WHERE (group_name LIKE ? OR group_code LIKE ? OR group_manager LIKE ? OR phone LIKE ? OR mobile LIKE ?)`;
        }
        const searchTerm = `%${dto.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
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
      const groupsWithImageUrls = result.map((group: any) => ({
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
    } catch (error) {
      console.error('Error fetching groups by status:', error);
      return {
        status: 'error',
        message: 'Failed to fetch groups',
        error: error.message,
      };
    }
  }

  // Updated method to auto-generate group code with CONTINUOUS sequence
  private async generateGroupCode(companyId: number, userId?: number): Promise<string> {
    try {
      console.log(`🔍 Generating group code for company_id: ${companyId}, user_id: ${userId}`);

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
      const prefix = `G${branch_code}${branch_name}`;

      // Get the next CONTINUOUS sequence number by finding max sequence in existing group_codes
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

    } catch (error) {
      console.error('❌ Error in generateGroupCode:', error);
      
      // Ultimate fallback - use timestamp
      const fallbackCode = `GERR${Date.now().toString().slice(-4)}`;
      console.log(`🆘 Using emergency fallback code: ${fallbackCode}`);
      return fallbackCode;
    }
  }

  async addGroupWithImage(groupDto: any): Promise<{ status: string; message: string; data?: any }> {
    try {
      const {
        company_id,
        group_name,
        group_code, // This will be ignored - we'll auto-generate
        phone,
        mobile, // Added mobile field
        image,
        user_id // Optional user_id for more specific group code generation
      } = groupDto;

      console.log(`Adding group with group_name: ${group_name}, company_id: ${company_id}, phone: ${phone}`);

      // Auto-lookup user_id from phone number not provided
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

      // Auto-generate group_code (with finalUserId if available)
      const autoGeneratedGroupCode = await this.generateGroupCode(company_id, finalUserId);

      // GROUP VALIDATION
      // Check if group already exists in the same company (by group_name)
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
          throw new HttpException(
            {
              status: 'error',
              message: `Group already exists in this company`,
              details: `Existing group "${existingGroup.group_name}"`,
            },
            HttpStatus.CONFLICT, // 409 Conflict
          );
        } else {
          console.log(`✅ ALLOWING: No existing group with same name in company ${company_id}`);
        }
      }

      // Save image if provided
      const imageFileName = await this.saveImage(image);

      // Use parameterized query to prevent SQL injection - NOW includes mobile column
      const sql = `
        INSERT INTO io_group (
          company_id, group_name, group_code, phone, mobile, group_image, create_by, created_date, updated_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
        company_id,
        group_name,
        autoGeneratedGroupCode, // Use auto-generated code
        phone,
        mobile, // Added mobile value
        imageFileName,
        finalUserId // Use the looked-up or provided user_id
      ];

      console.log('Executing SQL with values:', values);
      const result = await this.dataSource.query(sql, values);

      // Get the created group for response
      const createdGroup = await this.dataSource.query(
        `SELECT * FROM io_group WHERE group_id = ?`,
        [result.insertId]
      );

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
    } catch (error) {
      console.error('Error creating group:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Otherwise, wrap in generic error
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create group',
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

  async updateGroupWithImage(
    groupId: number,
    groupDto: any,
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
      console.log('📝 Received groupDto:', JSON.stringify(groupDto, null, 2));

      const {
        company_id,
        group_name,
        group_code,
        phone,
        mobile, // Added mobile field
        image
        
      } = groupDto;

      // Find existing group
      const [existingGroup] = await this.dataSource.query(
        `SELECT * FROM io_group WHERE group_id = ?`,
        [groupId],
      );
      
      if (!existingGroup) {
        throw new NotFoundException('Group not found');
      }

      // Handle image: use new image if provided, else keep existing one
      let imageFileName = existingGroup.group_image;
      if (image) {
        // Delete old image if it exists
        if (existingGroup.group_image) {
          try {
            const oldImagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingGroup.group_image);
            await fs.unlink(oldImagePath);
            console.log(`🗑️ Old image deleted: ${existingGroup.group_image}`);
          } catch (imageError) {
            console.warn(`⚠️ Could not delete old image: ${imageError.message}`);
          }
        }
        // Save new image
        imageFileName = await this.saveImage(image);
      }

      // Prepare fields to update dynamically - includes mobile column
      const updates: string[] = [];
      const values: any[] = [];

      // Helper to add field only if value is not null or undefined
      const addField = (fieldName: string, value: any) => {
        if (value !== null && value !== undefined) {
          updates.push(`${fieldName} = ?`);
          values.push(value);
        }
      };

      // Update columns that exist in your database including mobile
      addField('company_id', company_id);
      addField('group_name', group_name);
      addField('group_code', group_code);
      addField('phone', phone);
      addField('mobile', mobile); // Added mobile field handling
      addField('group_image', imageFileName);

      // Always update the updated_date
      updates.push('updated_date = NOW()');

      if (updates.length <= 1) { // Only updated_date
        throw new Error('No valid fields to update');
      }

      // Add WHERE condition value
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
        throw new NotFoundException('Group not found or no changes made');
      }

      // Get updated group for response
      const [updatedGroup] = await this.dataSource.query(
        `SELECT * FROM io_group WHERE group_id = ?`,
        [groupId],
      );

      console.log('✅ Group update complete for group_id:', groupId);
      return {
        status: 'success',
        message: 'Group updated successfully',
        data: updatedGroup
      };
    } catch (error) {
      console.error('❌ Error updating group:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update group',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteGroup(groupId: number): Promise<{ status: string; message: string }> {
    try {
      // Check if group exists and get image filename for cleanup
      const [existingGroup] = await this.dataSource.query(
        `SELECT group_id, group_name, group_image FROM io_group WHERE group_id = ?`,
        [groupId],
      );
      
      if (!existingGroup) {
        throw new NotFoundException('Group not found');
      }

      // Delete associated image file if exists
      if (existingGroup.group_image) {
        try {
          const imagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingGroup.group_image);
          await fs.unlink(imagePath);
          console.log(`🗑️ Image file deleted: ${existingGroup.group_image}`);
        } catch (imageError) {
          console.warn(`⚠️ Could not delete image file: ${imageError.message}`);
          // Don't fail the entire operation if image deletion fails
        }
      }

      // Hard delete from database
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
    } catch (error) {
      console.error('❌ Error deleting group:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete group',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Additional utility method to get group statistics
  async getGroupStats(companyId?: number): Promise<any> {
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
      
      const params: any[] = [];
      
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
    } catch (error) {
      console.error('Error fetching group stats:', error);
      return {
        status: 'error',
        message: 'Failed to fetch group statistics',
        error: error.message,
      };
    }
  }
}