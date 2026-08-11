import { CreateIoLocationDto, UpdateIoLocationDto, IoLocationDto, FindLocationByIdDto } from 'src/dto/iolocation.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class IoLocationService {
  constructor(private dataSource: DataSource) {}

  async findLocationById(dto: FindLocationByIdDto): Promise<any> {
    try {
      const query = `SELECT * FROM io_location WHERE location_id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `Location with ID ${dto.id} not found`,
          data: [],
        };
      }

      // Add full image URL if image exists
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
      const locationWithImageUrl = result.map((location: any) => ({
        ...location,
        image_url: location.image ? imageBaseUrl + location.image : null,
      }));

      return {
        status: 'success',
        message: 'Location fetched successfully',
        data: locationWithImageUrl,
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      return {
        status: 'error',
        message: 'Failed to fetch location info',
        error: error.message,
      };
    }
  }

  async findLocationsByStatus(dto: IoLocationDto): Promise<any> {
    try {
      let query: string;
      let params: any[] = [];

      if (dto.status?.toLowerCase() === 'admin') {
        // Admin: show all locations, but filter by company_id if provided
        if (dto.company_id) {
          query = `SELECT * FROM io_location WHERE company_id = ?`;
          params.push(dto.company_id);
        } else {
          query = `SELECT * FROM io_location`;
        }
      } else {
        // Non-admin: filter by status and company_id
        if (dto.company_id && dto.status) {
          query = `SELECT * FROM io_location WHERE status = ? AND company_id = ?`;
          params.push(dto.status, dto.company_id);
        } else if (dto.status) {
          query = `SELECT * FROM io_location WHERE status = ?`;
          params.push(dto.status);
        } else {
          query = `SELECT * FROM io_location`;
        }
      }

      const result = await this.dataSource.query(query, params);

      // Base URL where images are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

      // Append full image URLs
      const locationsWithImageUrls = result.map((location: any) => ({
        ...location,
        image_url: location.image ? imageBaseUrl + location.image : null,
      }));

      return {
        status: 'success',
        message: dto.status?.toLowerCase() === 'admin'
          ? `All locations fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
          : `Locations with status ${dto.status}${dto.company_id ? ` for company ${dto.company_id}` : ''} fetched`,
        data: locationsWithImageUrls,
      };
    } catch (error) {
      console.error('Error fetching locations by status:', error);
      return {
        status: 'error',
        message: 'Failed to fetch locations',
        error: error.message,
      };
    }
  }

  async addLocationWithImage(locationDto: any): Promise<{ status: string; message: string }> {
    try {
      const {
        company_id,
        location,
        image
      } = locationDto;

      console.log(`Adding location with location: ${location}, company_id: ${company_id}`);

      // LOCATION VALIDATION
      // Check if location already exists in the same company
      if (location && company_id) {
        const existingLocationQuery = `
          SELECT location, company_id 
          FROM io_location 
          WHERE location = ? AND company_id = ?
        `;
        const existingLocations = await this.dataSource.query(existingLocationQuery, [location, company_id]);

        if (existingLocations && existingLocations.length > 0) {
          const existingLocation = existingLocations[0];
          console.log(`Found existing location:`, existingLocation);

          console.log(`❌ REJECTING: Location ${location} already exists in company ${company_id}`);
          throw new HttpException(
            {
              status: 'error',
              message: `Location ${location} already exists in this company`,
              details: `Existing location "${existingLocation.location}"`,
            },
            HttpStatus.CONFLICT, // 409 Conflict
          );
        } else {
          console.log(`✅ ALLOWING: No existing location with location ${location} in company ${company_id}`);
        }
      }

      // Save image if provided
      const imageFileName = await this.saveImage(image);

      // Use parameterized query to prevent SQL injection
      const sql = `
        INSERT INTO io_location (
          company_id, location, image
        ) VALUES (?, ?, ?)
      `;

      const values = [
        company_id,
        location,
        imageFileName,
      ];

      console.log('Executing SQL with values:', values);
      await this.dataSource.query(sql, values);

      console.log(`✅ Location created successfully: ${location} in company ${company_id}`);
      return {
        status: 'success',
        message: 'Location created successfully',
      };
    } catch (error) {
      console.error('Error creating location:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Otherwise, wrap in generic error
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create location',
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

  async updateLocationWithImage(
    locationId: number,
    locationDto: any,
  ): Promise<{ status: string; message: string }> {
    try {
      console.log('📝 Received locationDto:', JSON.stringify(locationDto, null, 2));

      const {
        company_id,
        location,
        image
      } = locationDto;

      // Find existing location
      const [existingLocation] = await this.dataSource.query(
        `SELECT image FROM io_location WHERE location_id = ?`,
        [locationId],
      );
      
      if (!existingLocation) {
        throw new NotFoundException('Location not found');
      }

      // Handle image: use new image if provided, else keep existing one
      const imageFileName = image ? await this.saveImage(image) : existingLocation.image;

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
      addField('location', location);
      addField('image', imageFileName);

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add WHERE condition value
      values.push(locationId);

      const sql = `
        UPDATE io_location SET
          ${updates.join(', ')}
        WHERE location_id = ?
      `;

      console.log('🧾 Executing SQL:\n', sql);
      console.log('📦 With values:', values);

      const result = await this.dataSource.query(sql, values);
      
      if (result.affectedRows === 0) {
        throw new NotFoundException('Location not found or no changes made');
      }

      console.log('✅ Location update complete for location_id:', locationId);
      return {
        status: 'success',
        message: 'Location updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating location:', error.message);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update location',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteLocation(locationId: number): Promise<{ status: string; message: string }> {
    try {
      // Check if location exists
      const [existingLocation] = await this.dataSource.query(
        `SELECT location_id, location FROM io_location WHERE location_id = ?`,
        [locationId],
      );
      
      if (!existingLocation) {
        throw new NotFoundException('Location not found');
      }

      // Hard delete from database
      const sql = `DELETE FROM io_location WHERE location_id = ?`;

      const result = await this.dataSource.query(sql, [locationId]);
      
      if (result.affectedRows === 0) {
        throw new Error('Failed to delete location');
      }

      console.log(`✅ Location deleted successfully: ${existingLocation.location} (ID: ${locationId})`);
      return {
        status: 'success',
        message: 'Location deleted successfully',
      };
    } catch (error) {
      console.error('❌ Error deleting location:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete location',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}