import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UpdateAdvertisingStatusDto } from 'src/dto/update-advertising-status.dto';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import * as path from 'path';

interface AdvertisingDto {
  advertising_note: string;
  advertising_photo?: string; // base64 string
  advertising_index: number;
  advertising_status: string;
  advertising_link?: string;
}

interface AdvertisingResponse {
  status: string;
  message: string;
  data?: any;
  error?: string;
}

@Injectable()
export class AdvertisingService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Update advertising status by ID
   */
  async updateAdvertisingStatus(
    id: number,
    statusDto: UpdateAdvertisingStatusDto,
  ): Promise<AdvertisingResponse> {
    try {
      const { advertising_status } = statusDto;

      const sql = `UPDATE kd_advertising SET advertising_status = ? WHERE advertising_id = ?`;
      const values = [advertising_status, id];

      const result = await this.dataSource.query(sql, values);
      
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Advertising not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: 'success',
        message: 'Advertising status updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update advertising status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all advertisings with photo URLs
   */
  
  async getAllAdvertisings(): Promise<AdvertisingResponse> {
    try {
      const query = `
        SELECT *
        FROM kd_advertising
        ORDER BY advertising_date DESC
      `;
      const result = await this.dataSource.query(query);

      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/advertising/`;

      const updatedData = result.map(item => ({
        ...item,
        advertising_photo: item.advertising_photo 
          ? `${imageBaseUrl}${item.advertising_photo}` 
          : null,
      }));

      return {
        status: 'success',
        message: 'All advertisings retrieved successfully',
        data: updatedData,
      };
    } catch (error) {
      console.error('Error fetching advertisings:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch advertisings',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create new advertising with photo
   */
  async addAdvertisingWithPhoto(advertisingDto: AdvertisingDto): Promise<AdvertisingResponse> {
    try {
      console.log('📥 Received advertising data:', advertisingDto);

      const {
        advertising_note,
        advertising_photo,
        advertising_index,
        advertising_status,
        advertising_link,
      } = advertisingDto;

      const photoFilename = await this.saveAdvertisingImage(advertising_photo);

      const sql = `
        INSERT INTO kd_advertising (
          advertising_note, advertising_photo, advertising_date, 
          advertising_index, advertising_status, advertising_link
        ) VALUES (?, ?, NOW(), ?, ?, ?)
      `;

      const values = [
        advertising_note, 
        photoFilename, 
        advertising_index, 
        advertising_status, 
        advertising_link
      ];

      console.log('📦 Executing SQL:', sql);
      console.log('🧾 Values:', values);

      await this.dataSource.query(sql, values);

      console.log('✅ Advertising created with photo:', photoFilename);

      return {
        status: 'success',
        message: 'Advertising created successfully',
      };
    } catch (error) {
      console.error('❌ Error creating advertising:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create advertising',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update existing advertising
   */
  async updateAdvertising(id: number, advertisingDto: AdvertisingDto): Promise<AdvertisingResponse> {
    try {
      console.log('📥 Received update data for ID:', id, advertisingDto);

      const {
        advertising_note,
        advertising_photo,
        advertising_index,
        advertising_status,
        advertising_link,
      } = advertisingDto;

      let photoFilename: string | null = null;

      // Save new photo if provided
      if (advertising_photo) {
        photoFilename = await this.saveAdvertisingImage(advertising_photo);
      }

      // Build dynamic SQL query
      const setParts: string[] = [
        'advertising_note = ?',
        'advertising_index = ?',
        'advertising_status = ?',
        'advertising_link = ?'
      ];
      
      const values: any[] = [
        advertising_note,
        advertising_index,
        advertising_status,
        advertising_link
      ];

      // Add photo update if new photo provided
      if (photoFilename) {
        setParts.push('advertising_photo = ?');
        values.push(photoFilename);
      }

      values.push(id); // WHERE clause parameter

      const sql = `
        UPDATE kd_advertising 
        SET ${setParts.join(', ')}
        WHERE advertising_id = ?
      `;

      console.log('📦 Executing SQL:', sql);
      console.log('🧾 Values:', values);

      const result = await this.dataSource.query(sql, values);

      if (result.affectedRows === 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Advertising not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('✅ Advertising updated:', id);

      return {
        status: 'success',
        message: 'Advertising updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('❌ Error updating advertising:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update advertising',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete advertising by ID
   */
  async deleteAdvertising(id: number): Promise<AdvertisingResponse> {
    try {
      // First, get the advertising to check if it exists and get photo filename
      const existingAd = await this.dataSource.query(
        'SELECT advertising_photo FROM kd_advertising WHERE advertising_id = ?',
        [id]
      );

      if (existingAd.length === 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Advertising not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Delete the record
      await this.dataSource.query(
        'DELETE FROM kd_advertising WHERE advertising_id = ?',
        [id]
      );

      // Optionally delete the photo file
      if (existingAd[0].advertising_photo) {
        await this.deleteAdvertisingImage(existingAd[0].advertising_photo);
      }

      return {
        status: 'success',
        message: `Advertising with ID ${id} deleted successfully`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('❌ Error deleting advertising:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete advertising',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Save base64 image to filesystem
   */
  private async saveAdvertisingImage(base64Str: string | undefined): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'advertising');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await fs.writeFile(filePath, data, 'base64');
      console.log('📸 Image saved:', uniqueName);
      
      return uniqueName;
    } catch (error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  /**
   * Delete advertising image from filesystem
   */
  private async deleteAdvertisingImage(filename: string): Promise<void> {
    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'advertising');
      const filePath = path.join(uploadPath, filename);
      
      await fs.unlink(filePath);
      console.log('🗑️ Image deleted:', filename);
    } catch (error) {
      // Don't throw error if file doesn't exist
      console.warn('⚠️ Could not delete image file:', filename, error.message);
    }
  }

  /**
   * Parse base64 image string
   */
  private parseBase64Image(base64Str: string): { mimeType: string; data: string } {
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }

    return {
      mimeType: matches[1],
      data: matches[2],
    };
  }

  /**
   * Get file extension from MIME type
   */
  private getFileExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };

    const ext = extensions[mimeType.toLowerCase()];
    if (!ext) {
      throw new Error(`Unsupported image type: ${mimeType}`);
    }

    return ext;
  }
}