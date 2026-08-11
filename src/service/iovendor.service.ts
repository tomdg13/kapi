import { IovendorDto, FindvendorByIdDto } from 'src/dto/iovendor.dto';

import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class IovendorService {
  constructor(private dataSource: DataSource) {}

  async findvendorById(dto: FindvendorByIdDto): Promise<any> {
    try {
      const query = `SELECT * FROM io_vendor WHERE vendor_id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `Vendor with ID ${dto.id} not found`,
          data: [],
        };
      }

      // Add full image URL if image exists
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iovendor/`;
      const vendorWithImageUrl = result.map((vendor: any) => ({
        ...vendor,
        image_url: vendor.image ? imageBaseUrl + vendor.image : null,
      }));

      return {
        status: 'success',
        message: 'Vendor fetched successfully',
        data: vendorWithImageUrl,
      };
    } catch (error) {
      console.error('Error fetching vendor:', error);
      return {
        status: 'error',
        message: 'Failed to fetch vendor info',
        error: error.message,
      };
    }
  }


  async findvendorsByStatus(dto: IovendorDto): Promise<any> {
  try {
    let query: string;
    let params: any[] = [];

    if (dto.status?.toLowerCase() === 'admin') {
      // Admin: show all vendors, but filter by company_id if provided
      if (dto.company_id) {
        query = `SELECT * FROM io_vendor WHERE company_id = ?`;
        params.push(dto.company_id);
      } else {
        query = `SELECT * FROM io_vendor`;
      }
    } else {
      // Non-admin: filter by status and/or company_id
      const conditions: string[] = [];
      
      if (dto.status) {
        conditions.push('status = ?');
        params.push(dto.status);
      }
      
      if (dto.company_id) {
        conditions.push('company_id = ?');
        params.push(dto.company_id);
      }
      
      if (conditions.length > 0) {
        query = `SELECT * FROM io_vendor WHERE ${conditions.join(' AND ')}`;
      } else {
        query = `SELECT * FROM io_vendor`;
      }
    }

    const result = await this.dataSource.query(query, params);

    // Base URL where images are hosted
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iovendor/`;

    // Append full image URLs
    const vendorsWithImageUrls = result.map((vendor: any) => ({
      ...vendor,
      image_url: vendor.image ? imageBaseUrl + vendor.image : null,
    }));

    // Generate appropriate message
    let message = 'Vendors fetched';
    if (dto.status?.toLowerCase() === 'admin') {
      message = `All vendors fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`;
    } else {
      const filters = [];
      if (dto.status) filters.push(`status ${dto.status}`);
      if (dto.company_id) filters.push(`company ${dto.company_id}`);
      if (filters.length > 0) {
        message = `Vendors with ${filters.join(' and ')} fetched`;
      }
    }

    return {
      status: 'success',
      message,
      data: vendorsWithImageUrls,
    };
  } catch (error) {
    console.error('Error fetching vendors by status:', error);
    return {
      status: 'error',
      message: 'Failed to fetch vendors',
      error: error.message,
    };
  }
}


  // async findvendorsByStatus(dto: IovendorDto): Promise<any> {
  //   try {
  //     let query: string;
  //     let params: any[] = [];

  //     if (dto.status?.toLowerCase() === 'admin') {
  //       // Admin: show all vendors, but filter by company_id if provided
  //       if (dto.company_id) {
  //         query = `SELECT * FROM io_vendor WHERE company_id = ?`;
  //         params.push(dto.company_id);
  //       } else {
  //         query = `SELECT * FROM io_vendor`;
  //       }
  //     } else {
  //       // Non-admin: filter by status and company_id
  //       if (dto.company_id && dto.status) {
  //         query = `SELECT * FROM io_vendor WHERE status = ? AND company_id = ?`;
  //         params.push(dto.status, dto.company_id);
  //       } else if (dto.status) {
  //         query = `SELECT * FROM io_vendor WHERE status = ?`;
  //         params.push(dto.status);
  //       } else {
  //         query = `SELECT * FROM io_vendor`;
  //       }
  //     }

  //     const result = await this.dataSource.query(query, params);

  //     // Base URL where images are hosted
  //     const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iovendor/`;

  //     // Append full image URLs
  //     const vendorsWithImageUrls = result.map((vendor: any) => ({
  //       ...vendor,
  //       image_url: vendor.image ? imageBaseUrl + vendor.image : null,
  //     }));

  //     return {
  //       status: 'success',
  //       message: dto.status?.toLowerCase() === 'admin'
  //         ? `All vendors fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
  //         : `Vendors with status ${dto.status}${dto.company_id ? ` for company ${dto.company_id}` : ''} fetched`,
  //       data: vendorsWithImageUrls,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching vendors by status:', error);
  //     return {
  //       status: 'error',
  //       message: 'Failed to fetch vendors',
  //       error: error.message,
  //     };
  //   }
  // }

  async addVendor(vendorDto: any): Promise<{ status: string; message: string }> {
    try {
      const {
        company_id,
        vendor_name,
        vendor_code,
        contact_person,
        email,
        phone,
        address,
        city,
        state,
        country,
        postal_code,
        vendor_type = 'both',
        status = 'active',
        notes
      } = vendorDto;

      console.log(`Adding vendor with name: ${vendor_name}, company_id: ${company_id}`);

      // Save image if provided
      const imageFileName = await this.saveImage(vendorDto.image);

      // VENDOR NAME VALIDATION
      // Check if vendor name already exists in the same company
      if (vendor_name && company_id) {
        const existingVendorQuery = `
          SELECT vendor_name, company_id 
          FROM io_vendor 
          WHERE vendor_name = ? AND company_id = ?
        `;
        const existingVendors = await this.dataSource.query(existingVendorQuery, [vendor_name, company_id]);

        if (existingVendors && existingVendors.length > 0) {
          const existingVendor = existingVendors[0];
          console.log(`Found existing vendor:`, existingVendor);

          console.log(`❌ REJECTING: Vendor ${vendor_name} already exists in company ${company_id}`);
          throw new HttpException(
            {
              status: 'error',
              message: `Vendor ${vendor_name} already exists in this company`,
              details: `Existing vendor "${existingVendor.vendor_name}"`,
            },
            HttpStatus.CONFLICT, // 409 Conflict
          );
        } else {
          console.log(`✅ ALLOWING: No existing vendor with name ${vendor_name} in company ${company_id}`);
        }
      }

      // VENDOR CODE VALIDATION (if provided)
      if (vendor_code) {
        const existingCodeQuery = `
          SELECT vendor_code 
          FROM io_vendor 
          WHERE vendor_code = ?
        `;
        const existingCodes = await this.dataSource.query(existingCodeQuery, [vendor_code]);

        if (existingCodes && existingCodes.length > 0) {
          console.log(`❌ REJECTING: Vendor code ${vendor_code} already exists`);
          throw new HttpException(
            {
              status: 'error',
              message: `Vendor code ${vendor_code} already exists`,
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Use parameterized query to prevent SQL injection
      const sql = `
        INSERT INTO io_vendor (
          company_id, vendor_name, vendor_code, contact_person, email, phone, 
          address, city, state, country, postal_code, vendor_type, status, notes, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        company_id,
        vendor_name,
        vendor_code || null,
        contact_person || null,
        email || null,
        phone || null,
        address || null,
        city || null,
        state || null,
        country || null,
        postal_code || null,
        vendor_type,
        status,
        notes || null,
        imageFileName,
      ];

      console.log('Executing SQL with values:', values);
      await this.dataSource.query(sql, values);

      console.log(`✅ Vendor created successfully: ${vendor_name} in company ${company_id}`);
      return {
        status: 'success',
        message: 'Vendor created successfully',
      };
    } catch (error) {
      console.error('Error creating vendor:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Otherwise, wrap in generic error
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create vendor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateVendor(
    vendorId: number,
    vendorDto: any,
  ): Promise<{ status: string; message: string }> {
    try {
      console.log('📝 Received vendorDto:', JSON.stringify(vendorDto, null, 2));

      const {
        company_id,
        vendor_name,
        vendor_code,
        contact_person,
        email,
        phone,
        address,
        city,
        state,
        country,
        postal_code,
        vendor_type,
        status,
        notes
      } = vendorDto;

      // Find existing vendor
      const [existingVendor] = await this.dataSource.query(
        `SELECT image FROM io_vendor WHERE vendor_id = ?`,
        [vendorId],
      );
      
      if (!existingVendor) {
        throw new NotFoundException('Vendor not found');
      }

      // Handle image: use new image if provided, else keep existing one
      const imageFileName = vendorDto.image ? await this.saveImage(vendorDto.image) : existingVendor.image;

      // Check for duplicate vendor name in same company (excluding current vendor)
      if (vendor_name && company_id) {
        const duplicateNameQuery = `
          SELECT vendor_id FROM io_vendor 
          WHERE vendor_name = ? AND company_id = ? AND vendor_id != ?
        `;
        const duplicates = await this.dataSource.query(duplicateNameQuery, [vendor_name, company_id, vendorId]);
        
        if (duplicates.length > 0) {
          throw new HttpException(
            {
              status: 'error',
              message: `Vendor name ${vendor_name} already exists in this company`,
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Check for duplicate vendor code (excluding current vendor)
      if (vendor_code) {
        const duplicateCodeQuery = `
          SELECT vendor_id FROM io_vendor 
          WHERE vendor_code = ? AND vendor_id != ?
        `;
        const duplicates = await this.dataSource.query(duplicateCodeQuery, [vendor_code, vendorId]);
        
        if (duplicates.length > 0) {
          throw new HttpException(
            {
              status: 'error',
              message: `Vendor code ${vendor_code} already exists`,
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Prepare fields to update dynamically
      const updates: string[] = [];
      const values: any[] = [];

      // Helper to add field only if value is not null or undefined
      const addField = (fieldName: string, value: any) => {
        if (value !== null && value !== undefined) {
          updates.push(`${fieldName} = ?`);
          values.push(value);
        }
      };

      addField('company_id', company_id);
      addField('vendor_name', vendor_name);
      addField('vendor_code', vendor_code);
      addField('contact_person', contact_person);
      addField('email', email);
      addField('phone', phone);
      addField('address', address);
      addField('city', city);
      addField('state', state);
      addField('country', country);
      addField('postal_code', postal_code);
      addField('vendor_type', vendor_type);
      addField('status', status);
      addField('notes', notes);
      addField('image', imageFileName);

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add WHERE condition value
      values.push(vendorId);

      const sql = `
        UPDATE io_vendor SET
          ${updates.join(', ')}
        WHERE vendor_id = ?
      `;

      console.log('🧾 Executing SQL:\n', sql);
      console.log('📦 With values:', values);

      const result = await this.dataSource.query(sql, values);
      
      if (result.affectedRows === 0) {
        throw new NotFoundException('Vendor not found or no changes made');
      }

      console.log('✅ Vendor update complete for vendor_id:', vendorId);
      return {
        status: 'success',
        message: 'Vendor updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating vendor:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update vendor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteVendor(vendorId: number): Promise<{ status: string; message: string }> {
    try {
      // Check if vendor exists
      const [existingVendor] = await this.dataSource.query(
        `SELECT vendor_id, vendor_name FROM io_vendor WHERE vendor_id = ?`,
        [vendorId],
      );
      
      if (!existingVendor) {
        throw new NotFoundException('Vendor not found');
      }

      // Hard delete from database
      const sql = `DELETE FROM io_vendor WHERE vendor_id = ?`;

      const result = await this.dataSource.query(sql, [vendorId]);
      
      if (result.affectedRows === 0) {
        throw new Error('Failed to delete vendor');
      }

      console.log(`✅ Vendor deleted successfully: ${existingVendor.vendor_name} (ID: ${vendorId})`);
      return {
        status: 'success',
        message: 'Vendor deleted successfully',
      };
    } catch (error) {
      console.error('❌ Error deleting vendor:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete vendor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Additional utility methods
  async getVendorsByType(company_id: number, vendor_type: 'input' | 'output' | 'both'): Promise<any> {
    try {
      const query = `
        SELECT * FROM io_vendor 
        WHERE company_id = ? AND vendor_type = ? AND status = 'active'
        ORDER BY vendor_name
      `;
      const result = await this.dataSource.query(query, [company_id, vendor_type]);

      // Add image URLs
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iovendor/`;
      const vendorsWithImageUrls = result.map((vendor: any) => ({
        ...vendor,
        image_url: vendor.image ? imageBaseUrl + vendor.image : null,
      }));

      return {
        status: 'success',
        message: `Active ${vendor_type} vendors fetched successfully`,
        data: vendorsWithImageUrls,
      };
    } catch (error) {
      console.error('Error fetching vendors by type:', error);
      return {
        status: 'error',
        message: 'Failed to fetch vendors by type',
        error: error.message,
      };
    }
  }

  async searchVendors(company_id: number, searchTerm: string): Promise<any> {
    try {
      const query = `
        SELECT * FROM io_vendor 
        WHERE company_id = ? AND (
          vendor_name LIKE ? OR 
          vendor_code LIKE ? OR 
          contact_person LIKE ? OR 
          email LIKE ?
        )
        ORDER BY vendor_name
      `;
      const searchPattern = `%${searchTerm}%`;
      const result = await this.dataSource.query(query, [
        company_id, 
        searchPattern, 
        searchPattern, 
        searchPattern, 
        searchPattern
      ]);

      // Add image URLs
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iovendor/`;
      const vendorsWithImageUrls = result.map((vendor: any) => ({
        ...vendor,
        image_url: vendor.image ? imageBaseUrl + vendor.image : null,
      }));

      return {
        status: 'success',
        message: `Search results for "${searchTerm}"`,
        data: vendorsWithImageUrls,
      };
    } catch (error) {
      console.error('Error searching vendors:', error);
      return {
        status: 'error',
        message: 'Failed to search vendors',
        error: error.message,
      };
    }
  }

  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;
    
    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'iovendor');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueFileName);

      await fs.writeFile(filePath, data, 'base64');
      return uniqueFileName;
    } catch (error) {
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
}