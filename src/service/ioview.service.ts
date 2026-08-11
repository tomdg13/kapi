import { CreateIoviewDto, UpdateIoviewDto, IoviewDto, FindViewByIdDto } from 'src/dto/ioview.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

// Additional DTOs that seem to be used but not imported
interface IoLocationDto {
  company_id: number;
}

interface IoProductDto {
  company_id: number;
}

interface IoTerminalDto {
  company_id: number;
}

@Injectable()
export class IoViewService {
  constructor(private dataSource: DataSource) {}

  /**
   * Find locations by company
   */
  async findLocations(dto: IoLocationDto): Promise<any> {
    try {
      const query = `SELECT * FROM iov_location WHERE company_id = ?`;
      const params = [dto.company_id];

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
        message: `Locations fetched for company ${dto.company_id}`,
        data: locationsWithImageUrls,
      };
    } catch (error) {
      console.error('Error fetching locations:', error);
      return {
        status: 'error',
        message: 'Failed to fetch locations',
        error: error.message,
      };
    }
  }

  /**
   * Find products by company
   */
  async findProducts(dto: IoProductDto): Promise<any> {
    try {
      console.log('🔍 [findProducts] Request DTO:', JSON.stringify(dto, null, 2));
      
      const query = `SELECT * FROM iov_product WHERE company_id = ?`;
      const params = [dto.company_id];

      console.log('🗄️ [findProducts] Executing query:', query);
      console.log('📝 [findProducts] Query params:', params);

      const result = await this.dataSource.query(query, params);
      console.log(`📊 [findProducts] Query result count: ${result.length}`);

      // Base URL where images are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/ioproduct/`;

      // Append full image URLs
      const productsWithImageUrls = result.map((product: any) => ({
        ...product,
        image_url: product.image ? imageBaseUrl + product.image : null,
      }));

      console.log('✅ [findProducts] Success response prepared');
      return {
        status: 'success',
        message: `Products fetched for company ${dto.company_id}`,
        data: productsWithImageUrls,
      };
    } catch (error) {
      console.error('❌ [findProducts] Error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch products',
        error: error.message,
      };
    }
  }

  /**
   * Find terminals by company
   */
  async findTerminals(dto: IoTerminalDto): Promise<any> {
    try {
      console.log('🔍 [findTerminals] Request DTO:', JSON.stringify(dto, null, 2));
      
      const query = `SELECT * FROM iov_terminal WHERE company_id = ?`;
      const params = [dto.company_id];

      console.log('🗄️ [findTerminals] Executing query:', query);
      console.log('📝 [findTerminals] Query params:', params);

      const result = await this.dataSource.query(query, params);
      console.log(`📊 [findTerminals] Query result count: ${result.length}`);

      // Base URL where images are hosted
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/ioterminal/`;

      // Append full image URLs
      const terminalsWithImageUrls = result.map((terminal: any) => ({
        ...terminal,
        image_url: terminal.image ? imageBaseUrl + terminal.image : null,
      }));

      console.log('✅ [findTerminals] Success response prepared');
      return {
        status: 'success',
        message: `Terminals fetched for company ${dto.company_id}`,
        data: terminalsWithImageUrls,
      };
    } catch (error) {
      console.error('❌ [findTerminals] Error:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminals',
        error: error.message,
      };
    }
  }
}