import { CreateIoterminalDto, UpdateIoterminalDto, IoterminalDto, FindTerminalByIdDto, FindTerminalsByExpireDateDto, FindTerminalsBySerialDto, FindTerminalsBySimDto } from 'src/dto/ioterminal.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class IoTerminalService {
  constructor(private dataSource: DataSource) {}

  // Helper method to get base URLs
  private getBaseUrls() {
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
    // Fix: Remove '/images' from base URL for PDFs
    const baseUrl = process.env.IMAGE_BASE_URL.replace('/images', '');
    const pdfBaseUrl = `${baseUrl}/pdfs/terminals/`;
    
    return { imageBaseUrl, pdfBaseUrl };
  }

  async findTerminalById(dto: FindTerminalByIdDto): Promise<any> {
    try {
      const query = `SELECT * FROM io_terminal WHERE terminal_id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `Terminal with ID ${dto.id} not found`,
          data: [],
        };
      }

      const { imageBaseUrl, pdfBaseUrl } = this.getBaseUrls();
      
      const terminalWithUrls = result.map((terminal: any) => ({
        ...terminal,
        image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
        pdf_url: terminal.terminal_pdf ? pdfBaseUrl + terminal.terminal_pdf : null,
      }));

      return {
        status: 'success',
        message: 'Terminal fetched successfully',
        data: terminalWithUrls,
      };
    } catch (error) {
      console.error('Error fetching terminal:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminal info',
        error: error.message,
      };
    }
  }

  async findTerminalsByStatus(dto: IoterminalDto): Promise<any> {
    try {
      let query: string;
      let params: any[] = [];

      if (dto.status?.toLowerCase() === 'admin') {
        if (dto.company_id) {
          query = `SELECT * FROM io_terminal WHERE company_id = ?`;
          params.push(dto.company_id);
        } else {
          query = `SELECT * FROM io_terminal`;
        }
      } else {
        if (dto.company_id) {
          query = `SELECT * FROM io_terminal WHERE company_id = ?`;
          params.push(dto.company_id);
        } else {
          query = `SELECT * FROM io_terminal`;
        }
      }

      if (dto.store_id) {
        if (params.length > 0) {
          query += ` AND store_id = ?`;
        } else {
          query += ` WHERE store_id = ?`;
        }
        params.push(dto.store_id);
      }

      if (dto.merchant_id) {
        if (params.length > 0 || dto.store_id) {
          query += ` AND merchant_id = ?`;
        } else {
          query += ` WHERE merchant_id = ?`;
        }
        params.push(dto.merchant_id);
      }

      if (dto.group_id) {
        if (params.length > 0 || dto.store_id || dto.merchant_id) {
          query += ` AND group_id = ?`;
        } else {
          query += ` WHERE group_id = ?`;
        }
        params.push(dto.group_id);
      }

      if (dto.search) {
        const searchCondition = params.length > 0 || dto.store_id || dto.merchant_id || dto.group_id ? 
          ` AND (terminal_name LIKE ? OR terminal_code LIKE ? OR phone LIKE ? OR serial_number LIKE ? OR sim_number LIKE ?)` :
          ` WHERE (terminal_name LIKE ? OR terminal_code LIKE ? OR phone LIKE ? OR serial_number LIKE ? OR sim_number LIKE ?)`;
        query += searchCondition;
        
        const searchTerm = `%${dto.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (dto.sort_by) {
        const sortOrder = dto.sort_order || 'ASC';
        query += ` ORDER BY ${dto.sort_by} ${sortOrder}`;
      } else {
        query += ` ORDER BY created_date DESC`;
      }

      if (dto.limit) {
        const offset = dto.page ? (dto.page - 1) * dto.limit : 0;
        query += ` LIMIT ? OFFSET ?`;
        params.push(dto.limit, offset);
      }

      const result = await this.dataSource.query(query, params);

      const { imageBaseUrl, pdfBaseUrl } = this.getBaseUrls();

      const terminalsWithUrls = result.map((terminal: any) => ({
        ...terminal,
        image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
        pdf_url: terminal.terminal_pdf ? pdfBaseUrl + terminal.terminal_pdf : null,
      }));

      return {
        status: 'success',
        message: dto.status?.toLowerCase() === 'admin'
          ? `All terminals fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
          : `Terminals${dto.company_id ? ` for company ${dto.company_id}` : ''} fetched`,
        data: terminalsWithUrls,
        pagination: dto.limit ? {
          page: dto.page || 1,
          limit: dto.limit,
          total: result.length
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching terminals by status:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminals',
        error: error.message,
      };
    }
  }

  async findTerminalsByCompanyAndStore(companyId: number, storeId: number): Promise<any> {
    try {
      const query = `SELECT * FROM io_terminal WHERE company_id = ? AND store_id = ?`;
      const result = await this.dataSource.query(query, [companyId, storeId]);

      const { imageBaseUrl, pdfBaseUrl } = this.getBaseUrls();

      const terminalsWithUrls = result.map((terminal: any) => ({
        ...terminal,
        image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
        pdf_url: terminal.terminal_pdf ? pdfBaseUrl + terminal.terminal_pdf : null,
      }));

      return {
        status: 'success',
        message: `Terminals fetched for company ${companyId} and store ${storeId}`,
        data: terminalsWithUrls,
        count: result.length
      };
    } catch (error) {
      console.error('Error fetching terminals by company and store:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminals',
        error: error.message,
      };
    }
  }

  private async generateTerminalCode(companyId: number, userId?: number): Promise<string> {
    try {
      console.log(`Generating terminal code for company_id: ${companyId}, user_id: ${userId}`);

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
      console.log('Branch info result:', branchResult);

      if (!branchResult || branchResult.length === 0) {
        const fallbackCode = `GDEF${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        console.log(`No branch found, using fallback code: ${fallbackCode}`);
        return fallbackCode;
      }

      const { branch_code, branch_name } = branchResult[0];
      const prefix = `03${branch_code}`;

      const sequenceQuery = `
        SELECT 
          IFNULL(
            MAX(CAST(RIGHT(terminal_code, 3) AS UNSIGNED)), 0
          ) + 1 as next_sequence
        FROM io_terminal 
        WHERE company_id = ?
        AND terminal_code LIKE ?
      `;

      const sequenceResult = await this.dataSource.query(sequenceQuery, [
        companyId, 
        `${prefix}%`
      ]);

      console.log('Sequence query result:', sequenceResult);

      const nextSequence = sequenceResult[0]?.next_sequence || 1;

      if (nextSequence > 999) {
        throw new Error(`Maximum terminal limit reached for branch ${branch_code}. Cannot exceed 999 terminals.`);
      }

      const paddedSequence = String(nextSequence).padStart(3, '0');
      const generatedCode = `${prefix}${paddedSequence}`;

      console.log(`Generated CONTINUOUS terminal_code: ${generatedCode} for company ${companyId}, branch ${branch_code}`);
      return generatedCode;

    } catch (error) {
      console.error('Error in generateTerminalCode:', error);
      
      const fallbackCode = `GERR${Date.now().toString().slice(-4)}`;
      console.log(`Using emergency fallback code: ${fallbackCode}`);
      return fallbackCode;
    }
  }

  async addTerminalWithImage(terminalDto: any): Promise<{ status: string; message: string; data?: any }> {
    try {
      const {
        store_id = 1,
        merchant_id,
        group_id,
        company_id,
        terminal_name,
        phone,
        serial_number,
        sim_number,
        expire_date,
        image,
        terminal_pdf,
        pdf_filename,
        user_id,
      } = terminalDto;

      console.log(`Adding terminal with terminal_name: ${terminal_name}, company_id: ${company_id}, store_id: ${store_id}`);

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

      const autoGeneratedTerminalCode = await this.generateTerminalCode(company_id, finalUserId);

      if (terminal_name && company_id) {
        const existingTerminalQuery = `
          SELECT terminal_name, terminal_code, company_id 
          FROM io_terminal 
          WHERE terminal_name = ? AND company_id = ?
        `;
        const queryParams = [terminal_name, company_id];

        const existingTerminals = await this.dataSource.query(existingTerminalQuery, queryParams);

        if (existingTerminals && existingTerminals.length > 0) {
          const existingTerminal = existingTerminals[0];
          console.log(`Found existing terminal:`, existingTerminal);

          console.log(`REJECTING: Terminal already exists in company ${company_id}`);
          throw new HttpException(
            {
              status: 'error',
              message: `Terminal already exists in this company`,
              details: `Existing terminal "${existingTerminal.terminal_name}"`,
            },
            HttpStatus.CONFLICT,
          );
        } else {
          console.log(`ALLOWING: No existing terminal with same name in company ${company_id}`);
        }
      }

      const imageFileName = await this.saveImage(image);
      const pdfFileName = await this.savePdf(terminal_pdf);

      const sql = `
        INSERT INTO io_terminal (
          store_id, merchant_id, group_id, company_id, terminal_name, terminal_code, 
          phone, serial_number, sim_number, expire_date, terminal_image, 
          terminal_pdf, pdf_filename, create_by, created_date, updated_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
        store_id,
        merchant_id,
        group_id,
        company_id,
        terminal_name,
        autoGeneratedTerminalCode,
        phone,
        serial_number,
        sim_number,
        expire_date,
        imageFileName,
        pdfFileName,
        pdf_filename,
        finalUserId ? finalUserId.toString() : null
      ];

      console.log('Executing SQL with values:', values);
      const result = await this.dataSource.query(sql, values);

      const createdTerminal = await this.dataSource.query(
        `SELECT * FROM io_terminal WHERE terminal_id = ?`,
        [result.insertId]
      );

      console.log(`Terminal created successfully: ${terminal_name} with code ${autoGeneratedTerminalCode} in company ${company_id}, store ${store_id}`);
      return {
        status: 'success',
        message: `Terminal created successfully with auto-generated code: ${autoGeneratedTerminalCode}`,
        data: {
          terminal_id: result.insertId,
          terminal_code: autoGeneratedTerminalCode,
          user_id: finalUserId,
          store_id: store_id,
          ...createdTerminal[0]
        }
      };
    } catch (error) {
      console.error('Error creating terminal:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create terminal',
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

      const { mimeType, data } = this.parseBase64File(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueFileName);

      await fs.writeFile(filePath, data, 'base64');
      console.log(`Image saved: ${uniqueFileName}`);
      return uniqueFileName;
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  private async savePdf(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;
    
    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'pdfs', 'terminals');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64File(base64Str);
      
      if (mimeType !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.pdf`;
      const filePath = path.join(uploadPath, uniqueFileName);

      await fs.writeFile(filePath, data, 'base64');
      console.log(`PDF saved: ${uniqueFileName}`);
      return uniqueFileName;
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error(`Failed to save PDF: ${error.message}`);
    }
  }

  private parseBase64File(base64Str: string): { mimeType: string; data: string } {
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

  async updateTerminalWithImage(
    terminalId: number,
    terminalDto: any,
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
      console.log('Received terminalDto:', JSON.stringify(terminalDto, null, 2));

      const {
        store_id,
        merchant_id,
        group_id,
        company_id,
        terminal_name,
        terminal_code,
        phone,
        serial_number,
        sim_number,
        expire_date,
        image,
        terminal_pdf,
        pdf_filename,
        create_by
      } = terminalDto;

      const [existingTerminal] = await this.dataSource.query(
        `SELECT * FROM io_terminal WHERE terminal_id = ?`,
        [terminalId],
      );
      
      if (!existingTerminal) {
        throw new NotFoundException('Terminal not found');
      }

      let imageFileName = existingTerminal.terminal_image;
      if (image) {
        if (existingTerminal.terminal_image) {
          try {
            const oldImagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingTerminal.terminal_image);
            await fs.unlink(oldImagePath);
            console.log(`Old image deleted: ${existingTerminal.terminal_image}`);
          } catch (imageError) {
            console.warn(`Could not delete old image: ${imageError.message}`);
          }
        }
        imageFileName = await this.saveImage(image);
      }

      let pdfStoredFileName = existingTerminal.terminal_pdf;
      let pdfOriginalFileName = existingTerminal.pdf_filename;
      
      if (terminal_pdf) {
        if (existingTerminal.terminal_pdf) {
          try {
            const oldPdfPath = path.resolve(process.cwd(), 'public', 'pdfs', 'terminals', existingTerminal.terminal_pdf);
            await fs.unlink(oldPdfPath);
            console.log(`Old PDF deleted: ${existingTerminal.terminal_pdf}`);
          } catch (pdfError) {
            console.warn(`Could not delete old PDF: ${pdfError.message}`);
          }
        }
        pdfStoredFileName = await this.savePdf(terminal_pdf);
        pdfOriginalFileName = pdf_filename || pdfStoredFileName;
      }

      const updates: string[] = [];
      const values: any[] = [];

      const addField = (fieldName: string, value: any) => {
        if (value !== null && value !== undefined) {
          updates.push(`${fieldName} = ?`);
          values.push(value);
        }
      };

      addField('store_id', store_id);
      addField('merchant_id', merchant_id);
      addField('group_id', group_id);
      addField('company_id', company_id);
      addField('terminal_name', terminal_name);
      addField('terminal_code', terminal_code);
      addField('phone', phone);
      addField('serial_number', serial_number);
      addField('sim_number', sim_number);
      addField('expire_date', expire_date);
      addField('terminal_image', imageFileName);
      addField('terminal_pdf', pdfStoredFileName);
      addField('pdf_filename', pdfOriginalFileName);
      addField('create_by', create_by);

      updates.push('approval_status = ?');
      values.push('reapproved');
      
      updates.push('approve1 = NULL');
      updates.push('approve2 = NULL');
      updates.push('approved_by = NULL');
      updates.push('approved_at = NULL');
      updates.push('rejection_reason = NULL');
      updates.push('updated_date = NOW()');

      if (updates.length <= 6) {
        throw new Error('No valid fields to update');
      }

      values.push(terminalId);

      const sql = `
        UPDATE io_terminal SET
          ${updates.join(', ')}
        WHERE terminal_id = ?
      `;

      console.log('Executing SQL:\n', sql);
      console.log('With values:', values);

      const result = await this.dataSource.query(sql, values);
      
      if (result.affectedRows === 0) {
        throw new NotFoundException('Terminal not found or no changes made');
      }

      const [updatedTerminal] = await this.dataSource.query(
        `SELECT * FROM io_terminal WHERE terminal_id = ?`,
        [terminalId],
      );

      console.log('Terminal update complete for terminal_id:', terminalId);
      return {
        status: 'success',
        message: 'Terminal updated successfully. Approval status has been reset and requires re-approval.',
        data: updatedTerminal
      };
    } catch (error) {
      console.error('Error updating terminal:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update terminal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTerminal(terminalId: number): Promise<{ status: string; message: string }> {
    try {
      const [existingTerminal] = await this.dataSource.query(
        `SELECT terminal_id, terminal_name, terminal_image, terminal_pdf FROM io_terminal WHERE terminal_id = ?`,
        [terminalId],
      );
      
      if (!existingTerminal) {
        throw new NotFoundException('Terminal not found');
      }

      if (existingTerminal.terminal_image) {
        try {
          const imagePath = path.resolve(process.cwd(), 'public', 'images', 'iouser', existingTerminal.terminal_image);
          await fs.unlink(imagePath);
          console.log(`Image file deleted: ${existingTerminal.terminal_image}`);
        } catch (imageError) {
          console.warn(`Could not delete image file: ${imageError.message}`);
        }
      }

      if (existingTerminal.terminal_pdf) {
        try {
          const pdfPath = path.resolve(process.cwd(), 'public', 'pdfs', 'terminals', existingTerminal.terminal_pdf);
          await fs.unlink(pdfPath);
          console.log(`PDF file deleted: ${existingTerminal.terminal_pdf}`);
        } catch (pdfError) {
          console.warn(`Could not delete PDF file: ${pdfError.message}`);
        }
      }

      const sql = `DELETE FROM io_terminal WHERE terminal_id = ?`;

      const result = await this.dataSource.query(sql, [terminalId]);
      
      if (result.affectedRows === 0) {
        throw new Error('Failed to delete terminal');
      }

      console.log(`Terminal deleted successfully: ${existingTerminal.terminal_name} (ID: ${terminalId})`);
      return {
        status: 'success',
        message: 'Terminal deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting terminal:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete terminal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTerminalStats(companyId?: number): Promise<any> {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_terminals,
          COUNT(CASE WHEN terminal_image IS NOT NULL THEN 1 END) as terminals_with_images,
          COUNT(CASE WHEN terminal_pdf IS NOT NULL THEN 1 END) as terminals_with_pdfs,
          COUNT(CASE WHEN serial_number IS NOT NULL THEN 1 END) as terminals_with_serial,
          COUNT(CASE WHEN sim_number IS NOT NULL THEN 1 END) as terminals_with_sim,
          COUNT(CASE WHEN expire_date IS NOT NULL THEN 1 END) as terminals_with_expire_date
        FROM io_terminal
      `;
      
      const params: any[] = [];
      
      if (companyId) {
        query += ` WHERE company_id = ?`;
        params.push(companyId);
      }

      const result = await this.dataSource.query(query, params);
      
      return {
        status: 'success',
        message: 'Terminal statistics fetched successfully',
        data: result[0]
      };
    } catch (error) {
      console.error('Error fetching terminal stats:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminal statistics',
        error: error.message,
      };
    }
  }

  async checkTerminalCodeExists(terminalCode: string, companyId?: number): Promise<boolean> {
    let query = `SELECT COUNT(*) as count FROM io_terminal WHERE terminal_code = ?`;
    const params: any[] = [terminalCode];
    
    if (companyId) {
      query += ` AND company_id = ?`;
      params.push(companyId.toString());
    }
    
    const result = await this.dataSource.query(query, params);
    return result[0].count > 0;
  }

  async findStoresByCompanyAndMerchant(companyId: number, merchantId: number): Promise<any> {
    try {
      const query = `SELECT * FROM io_store WHERE company_id = ? AND merchant_id = ?`;
      const result = await this.dataSource.query(query, [companyId, merchantId]);

      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

      const storesWithImageUrls = result.map((store: any) => ({
        ...store,
        image_url: store.store_image ? imageBaseUrl + store.store_image : null,
      }));

      return {
        status: 'success',
        message: `Stores fetched for company ${companyId} and merchant ${merchantId}`,
        data: storesWithImageUrls,
      };
    } catch (error) {
      console.error('Error fetching stores by company and merchant:', error);
      return {
        status: 'error',
        message: 'Failed to fetch stores',
        error: error.message,
      };
    }
  }

  async findTerminalsByIds(terminalIds: number[]): Promise<any> {
    try {
      const placeholders = terminalIds.map(() => '?').join(',');
      const query = `SELECT * FROM iov_terminal WHERE terminal_id IN (${placeholders})`;
      
      const result = await this.dataSource.query(query, terminalIds);

      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;

      const terminalsWithImageUrls = result.map((terminal: any) => ({
        ...terminal,
        group_image_url: terminal.group_image ? imageBaseUrl + terminal.group_image : null,
        merchant_image_url: terminal.merchant_image ? imageBaseUrl + terminal.merchant_image : null,
        store_image_url: terminal.store_image ? imageBaseUrl + terminal.store_image : null,
        terminal_image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
      }));

      return {
        status: 'success',
        message: `Terminal details fetched for ${terminalIds.length} terminal(s)`,
        data: terminalsWithImageUrls,
      };
    } catch (error) {
      console.error('Error fetching terminals by IDs:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminal details',
        error: error.message,
      };
    }
  }

  async findTerminalsBySerial(dto: FindTerminalsBySerialDto): Promise<any> {
    try {
      let query = `SELECT * FROM io_terminal WHERE serial_number = ?`;
      const params: any[] = [dto.serial_number];
      
      if (dto.company_id) {
        query += ` AND company_id = ?`;
        params.push(dto.company_id);
      }

      const result = await this.dataSource.query(query, params);

      const { imageBaseUrl, pdfBaseUrl } = this.getBaseUrls();

      const terminalsWithUrls = result.map((terminal: any) => ({
        ...terminal,
        image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
        pdf_url: terminal.terminal_pdf ? pdfBaseUrl + terminal.terminal_pdf : null,
      }));

      return {
        status: 'success',
        message: `Terminals with serial number ${dto.serial_number} fetched successfully`,
        data: terminalsWithUrls,
        count: result.length
      };
    } catch (error) {
      console.error('Error fetching terminals by serial number:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminals by serial number',
        error: error.message,
      };
    }
  }

  async findTerminalsBySim(dto: FindTerminalsBySimDto): Promise<any> {
    try {
      let query = `SELECT * FROM io_terminal WHERE sim_number = ?`;
      const params: any[] = [dto.sim_number];
      
      if (dto.company_id) {
        query += ` AND company_id = ?`;
        params.push(dto.company_id);
      }

      const result = await this.dataSource.query(query, params);

      const { imageBaseUrl, pdfBaseUrl } = this.getBaseUrls();

      const terminalsWithUrls = result.map((terminal: any) => ({
        ...terminal,
        image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
        pdf_url: terminal.terminal_pdf ? pdfBaseUrl + terminal.terminal_pdf : null,
      }));

      return {
        status: 'success',
        message: `Terminals with SIM number ${dto.sim_number} fetched successfully`,
        data: terminalsWithUrls,
        count: result.length
      };
    } catch (error) {
      console.error('Error fetching terminals by SIM number:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminals by SIM number',
        error: error.message,
      };
    }
  }

  async findTerminalsByExpireDate(dto: FindTerminalsByExpireDateDto): Promise<any> {
    try {
      let query = `SELECT * FROM io_terminal WHERE expire_date IS NOT NULL`;
      const params: any[] = [];

      if (dto.date_from && dto.date_to) {
        query += ` AND expire_date BETWEEN ? AND ?`;
        params.push(dto.date_from, dto.date_to);
      } else if (dto.date_from) {
        query += ` AND expire_date >= ?`;
        params.push(dto.date_from);
      } else if (dto.date_to) {
        query += ` AND expire_date <= ?`;
        params.push(dto.date_to);
      }

      if (dto.days_before_expiry !== undefined) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + dto.days_before_expiry);
        const futureDateStr = futureDate.toISOString().split('T')[0];
        
        query += ` AND expire_date <= ?`;
        params.push(futureDateStr);
      }

      if (dto.company_id) {
        query += ` AND company_id = ?`;
        params.push(dto.company_id);
      }

      query += ` ORDER BY expire_date ASC`;

      const result = await this.dataSource.query(query, params);

      const { imageBaseUrl, pdfBaseUrl } = this.getBaseUrls();

      const terminalsWithUrls = result.map((terminal: any) => {
        const today = new Date();
        const expireDate = new Date(terminal.expire_date);
        const daysUntilExpiry = Math.ceil((expireDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        
        return {
          ...terminal,
          image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
          pdf_url: terminal.terminal_pdf ? pdfBaseUrl + terminal.terminal_pdf : null,
          days_until_expiry: daysUntilExpiry,
          is_expired: daysUntilExpiry < 0,
          is_expiring_soon: daysUntilExpiry >= 0 && daysUntilExpiry <= 30
        };
      });

      let message = 'Terminals fetched successfully';
      if (dto.days_before_expiry !== undefined) {
        message = `Terminals expiring within ${dto.days_before_expiry} days fetched successfully`;
      } else if (dto.date_from && dto.date_to) {
        message = `Terminals with expiry dates between ${dto.date_from} and ${dto.date_to} fetched successfully`;
      }

      return {
        status: 'success',
        message,
        data: terminalsWithUrls,
        count: result.length,
        summary: {
          total: result.length,
          expired: terminalsWithUrls.filter(t => t.is_expired).length,
          expiring_soon: terminalsWithUrls.filter(t => t.is_expiring_soon).length,
        }
      };
    } catch (error) {
      console.error('Error fetching terminals by expiry date:', error);
      return {
        status: 'error',
        message: 'Failed to fetch terminals by expiry date',
        error: error.message,
      };
    }
  }

  async updateTerminalApproval(
    terminalId: number,
    approvalDto: any,
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
      const { approval_status, approved_by, approved_at, rejection_reason, approve1, approve2 } = approvalDto;

      const [existingTerminal] = await this.dataSource.query(
        `SELECT * FROM io_terminal WHERE terminal_id = ?`,
        [terminalId],
      );
      
      if (!existingTerminal) {
        throw new NotFoundException('Terminal not found');
      }

      const sql = `
        UPDATE io_terminal 
        SET 
          approval_status = ?,
          approved_by = ?,
          approved_at = ?,
          rejection_reason = ?,
          approve1 = ?,
          approve2 = ?
        WHERE terminal_id = ?
      `;

      const result = await this.dataSource.query(sql, [
        approval_status,
        approved_by,
        approved_at,
        rejection_reason || null,
        approve1 || null,
        approve2 || null,
        terminalId,
      ]);

      if (result.affectedRows === 0) {
        throw new NotFoundException('Terminal not found');
      }

      const [updatedTerminal] = await this.dataSource.query(
        `SELECT * FROM io_terminal WHERE terminal_id = ?`,
        [terminalId],
      );

      return {
        status: 'success',
        message: `Terminal approval ${approval_status} successfully`,
        data: updatedTerminal
      };
    } catch (error) {
      console.error('Error updating terminal approval:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update terminal approval',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTerminalsPendingApproval(companyId?: number): Promise<any> {
    try {
      let query = `
        SELECT 
          t.*,
          s.store_name,
          m.merchant_name,
          g.group_name,
          u1.user_name as approver1_name,
          u2.user_name as approver2_name
        FROM io_terminal t
        LEFT JOIN io_store s ON t.store_id = s.store_id
        LEFT JOIN io_merchant m ON t.merchant_id = m.merchant_id
        LEFT JOIN io_group g ON t.group_id = g.group_id
        LEFT JOIN io_user u1 ON t.approve1 = u1.user_id
        LEFT JOIN io_user u2 ON t.approve2 = u2.user_id
        WHERE t.approval_status IN ('pending', 'reapproved')
      `;
      const params: any[] = [];

      if (companyId) {
        query += ` AND t.company_id = ?`;
        params.push(companyId);
      }

      query += ` ORDER BY t.created_date DESC`;

      const result = await this.dataSource.query(query, params);

      const { imageBaseUrl, pdfBaseUrl } = this.getBaseUrls();
      
      const terminalsWithUrls = result.map((terminal: any) => ({
        ...terminal,
        image_url: terminal.terminal_image ? imageBaseUrl + terminal.terminal_image : null,
        pdf_url: terminal.terminal_pdf ? pdfBaseUrl + terminal.terminal_pdf : null,
      }));

      return {
        status: 'success',
        message: 'Pending terminals fetched successfully',
        data: terminalsWithUrls,
        count: result.length,
      };
    } catch (error) {
      console.error('Error fetching pending terminals:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch pending terminals',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}