import { CreateSettlementDetailsDto, UpdateSettlementDetailsDto, SettlementDetailsDto, FindByIdDto, FindByCompanyDto, GetSummaryDto, GetByStatusDto } from '../dto/settlement_details.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SettlementDetailsService {
  constructor(private dataSource: DataSource) {}

  // NEW: Check for duplicate system transaction IDs
  async checkDuplicates(
    company_id: number,
    system_transaction_ids: string[],
  ): Promise<any> {
    try {
      console.log(`Checking duplicates for company ${company_id}`);
      console.log(`Transaction IDs to check: ${system_transaction_ids.length}`);

      if (!company_id) {
        throw new HttpException(
          {
            status: 'error',
            message: 'company_id is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!system_transaction_ids || system_transaction_ids.length === 0) {
        return {
          status: 'success',
          message: 'No transaction IDs to check',
          data: {
            duplicates: [],
            count: 0,
          },
        };
      }

      // Find existing records
      const existingRecords = await this.findBySystemTransactionIds(
        company_id,
        system_transaction_ids,
      );

      // Extract just the IDs
      const duplicateIds = existingRecords.map(
        (record) => record.system_transaction_id,
      );

      console.log(`Found ${duplicateIds.length} duplicates out of ${system_transaction_ids.length} checked`);

      return {
        status: 'success',
        message: `Checked ${system_transaction_ids.length} transaction IDs, found ${duplicateIds.length} duplicates`,
        data: {
          duplicates: duplicateIds,
          count: duplicateIds.length,
          total_checked: system_transaction_ids.length,
        },
      };
    } catch (error) {
      console.error('Error checking duplicates:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to check for duplicates',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCompany(dto: FindByCompanyDto): Promise<any> {
    try {
      let query = `SELECT * FROM settlement_details WHERE company_id = ?`;
      const params: any[] = [dto.company_id];

      if (dto.start_date && dto.end_date) {
        query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
        params.push(dto.start_date, dto.end_date);
      }

      if (dto.transaction_status) {
        query += ` AND transaction_status = ?`;
        params.push(dto.transaction_status);
      }

      if (dto.funding_type) {
        query += ` AND funding_type = ?`;
        params.push(dto.funding_type);
      }

      if (dto.crossborder_flag) {
        query += ` AND crossborder_flag = ?`;
        params.push(dto.crossborder_flag);
      }

      if (dto.merchant_nation) {
        query += ` AND merchant_nation = ?`;
        params.push(dto.merchant_nation);
      }

      if (dto.issuer_country) {
        query += ` AND issuer_country = ?`;
        params.push(dto.issuer_country);
      }

      if (dto.payment_brand) {
        query += ` AND payment_brand = ?`;
        params.push(dto.payment_brand);
      }

      if (dto.source_filename) {
        query += ` AND source_filename = ?`;
        params.push(dto.source_filename);
      }

      if (dto.api_code) {
        query += ` AND api_code = ?`;
        params.push(dto.api_code);
      }

      query += ` ORDER BY transaction_time DESC`;

      if (dto.limit) {
        query += ` LIMIT ?`;
        params.push(dto.limit);
        
        if (dto.offset) {
          query += ` OFFSET ?`;
          params.push(dto.offset);
        }
      }

      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: `Settlement details fetched for company ${dto.company_id}`,
        data: result,
        count: result.length,
      };
    } catch (error) {
      console.error('Error fetching settlement details:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch settlement details',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private formatDateTimeForMySQL(isoDateTime: string): string {
    if (!isoDateTime) return null;
    try {
      return new Date(isoDateTime).toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      console.error('Invalid date format:', isoDateTime);
      return null;
    }
  }

  async create(dto: CreateSettlementDetailsDto): Promise<any> {
    try {
      if (!dto.company_id) {
        throw new HttpException(
          {
            message: 'company_id is required',
            errors: { company_id: ['Company ID is required'] }
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!dto.transaction_time) {
        throw new HttpException(
          {
            message: 'transaction_time is required',
            errors: { transaction_time: ['Transaction time is required'] }
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!dto.system_transaction_id || dto.system_transaction_id.trim() === '') {
        throw new HttpException(
          {
            message: 'system_transaction_id is required',
            errors: { system_transaction_id: ['System Transaction ID is required'] }
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const query = `
        INSERT INTO settlement_details (
          company_id, transaction_time, payment_time, order_number, psp_order_number,
          original_order_number, original_psp_order_number, transaction_amount, tips_amount,
          transaction_currency, merchant_settlement_amount, merchant_settlement_currency,
          mdr_amount, net_merchant_settlement_amount, brand_settlement_amount, brand_settlement_currency,
          interchange_fee_amount, net_brand_settlement_amount, reconciliation_flag, transaction_type,
          psp_name, payment_brand, card_number, authorization_code, mcc, crossborder_flag,
          group_id, group_name, merchant_id, merchant_name, store_id, store_name,
          terminal_id, terminal_settlement_time, batch_number, terminal_trace_number, remark,
          source_filename, merchant_nation, merchant_city, system_transaction_time, api_type,
          payment_method_variant, funding_type, product_id, product_type_id, issuer_country,
          merchant_order_reference, system_transaction_id, original_system_transaction_id,
          merchant_local_amount, local_tips_amount, local_surcharge_fee_amount, local_capture_amount,
          merchant_local_currency, rate_local_to_transaction, surcharge_fee_amount, merchant_capture_amount,
          merchant_discount_amount, rate_transaction_to_settlement, mdr_rules, psp_scheme_fee,
          acquirer_service_fee, transaction_service_fee, vat_amount, wht_amount,
          user_billing_amount, user_billing_currency, eci, transaction_initiation_mode,
          linkpay_order_id, transaction_status, system_result_code, psp_result_code,
          settlement_account_name, settlement_account_number, metadata, api_code
        ) VALUES (${Array(78).fill('?').join(', ')})
      `;

      const params = [
        dto.company_id,
        this.formatDateTimeForMySQL(dto.transaction_time),
        dto.payment_time ? this.formatDateTimeForMySQL(dto.payment_time) : null,
        dto.order_number || null,
        dto.psp_order_number || null,
        dto.original_order_number || null,
        dto.original_psp_order_number || null,
        dto.transaction_amount || 0,
        dto.tips_amount || 0,
        dto.transaction_currency || null,
        dto.merchant_settlement_amount || 0,
        dto.merchant_settlement_currency || null,
        dto.mdr_amount || 0,
        dto.net_merchant_settlement_amount || 0,
        dto.brand_settlement_amount || 0,
        dto.brand_settlement_currency || null,
        dto.interchange_fee_amount || 0,
        dto.net_brand_settlement_amount || 0,
        dto.reconciliation_flag || null,
        dto.transaction_type || null,
        dto.psp_name || null,
        dto.payment_brand || null,
        dto.card_number || null,
        dto.authorization_code || null,
        dto.mcc || null,
        dto.crossborder_flag || null,
        dto.group_id || null,
        dto.group_name || null,
        dto.merchant_id || null,
        dto.merchant_name || null,
        dto.store_id || null,
        dto.store_name || null,
        dto.terminal_id || 'UNKNOWN',
        dto.terminal_settlement_time ? this.formatDateTimeForMySQL(dto.terminal_settlement_time) : null,
        dto.batch_number || null,
        dto.terminal_trace_number || null,
        dto.remark || null,
        dto.source_filename || null,
        dto.merchant_nation || null,
        dto.merchant_city || null,
        dto.system_transaction_time ? this.formatDateTimeForMySQL(dto.system_transaction_time) : null,
        dto.api_type || null,
        dto.payment_method_variant || null,
        dto.funding_type || null,
        dto.product_id || null,
        dto.product_type_id || null,
        dto.issuer_country || null,
        dto.merchant_order_reference || null,
        dto.system_transaction_id,
        dto.original_system_transaction_id || null,
        dto.merchant_local_amount || 0,
        dto.local_tips_amount || 0,
        dto.local_surcharge_fee_amount || 0,
        dto.local_capture_amount || 0,
        dto.merchant_local_currency || null,
        dto.rate_local_to_transaction || 0,
        dto.surcharge_fee_amount || 0,
        dto.merchant_capture_amount || 0,
        dto.merchant_discount_amount || 0,
        dto.rate_transaction_to_settlement || 0,
        dto.mdr_rules || null,
        dto.psp_scheme_fee || 0,
        dto.acquirer_service_fee || 0,
        dto.transaction_service_fee || 0,
        dto.vat_amount || 0,
        dto.wht_amount || 0,
        dto.user_billing_amount || 0,
        dto.user_billing_currency || null,
        dto.eci || null,
        dto.transaction_initiation_mode || null,
        dto.linkpay_order_id || null,
        dto.transaction_status || null,
        dto.system_result_code || null,
        dto.psp_result_code || null,
        dto.settlement_account_name || null,
        dto.settlement_account_number || null,
        dto.metadata || null,
        dto.api_code || 'STANDARD_API',
      ];

      console.log(`Executing INSERT with ${params.length} parameters`);

      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: 'Settlement detail created successfully',
        data: { id: result.insertId },
      };
    } catch (error) {
      console.error('Error creating settlement detail:', error);
      
      if (error.code === 'ER_WRONG_VALUE_COUNT_ON_ROW') {
        throw new HttpException(
          {
            status: 'error',
            message: 'Column count mismatch - database structure issue',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            message: 'Duplicate transaction ID',
            errors: { system_transaction_id: ['This transaction ID already exists'] }
          },
          HttpStatus.CONFLICT,
        );
      }

      if (error.code === 'ER_DATA_TOO_LONG') {
        throw new HttpException(
          {
            status: 'error',
            message: 'Data too long for one or more columns',
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create settlement detail',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createFromCSV(csvData: any[], sourceFilename: string): Promise<any> {
    try {
      const results = [];
      const errors = [];
      let skippedRows = 0;
      
      for (let i = 0; i < csvData.length; i++) {
        try {
          const row = csvData[i];
          
          const hasAnyData = Object.values(row).some(val => 
            val !== null && val !== undefined && val.toString().trim() !== ''
          );
          
          if (!hasAnyData) {
            console.log(`Skipping empty row ${i + 2}`);
            skippedRows++;
            continue;
          }
          
          const systemTxnId = row['System Txn ID']?.toString().trim();
          const merchantId = row['Merchant ID']?.toString().trim();
          const merchantTxnTime = row['Merchant Txn Time'];
          
          if (!systemTxnId) {
            errors.push({
              row: i + 2,
              error: 'Missing System Txn ID (required field)',
              data: { systemTxnId: row['System Txn ID'] }
            });
            continue;
          }
          
          if (!merchantId) {
            errors.push({
              row: i + 2,
              error: 'Missing Merchant ID (required field)',
              data: { merchantId: row['Merchant ID'] }
            });
            continue;
          }
          
          if (!merchantTxnTime) {
            errors.push({
              row: i + 2,
              error: 'Missing Merchant Txn Time (required field)',
              data: { merchantTxnTime: row['Merchant Txn Time'] }
            });
            continue;
          }
          
          const dto: CreateSettlementDetailsDto = {
            company_id: this.parseNumber(row['PSP ID']) || 0,
            transaction_time: merchantTxnTime,
            payment_time: row['Txn Pay Time'],
            order_number: row['Merchant Txn ID'],
            psp_order_number: row['PSP Txn ID'],
            original_order_number: row['Original Merchant Txn ID'],
            original_psp_order_number: row['Original PSP Txn ID'],
            transaction_amount: this.parseNumber(row['Merchant Txn Amt']) || 0,
            tips_amount: this.parseNumber(row['Tips Amount']) || 0,
            transaction_currency: row['Merchant Txn Curr'],
            merchant_settlement_amount: this.parseNumber(row['Merchant Sttl Amt']) || 0,
            merchant_settlement_currency: row['Merchant Sttl Curr'],
            mdr_amount: this.parseNumber(row['MDR Amount']) || 0,
            net_merchant_settlement_amount: this.parseNumber(row['Net Merchant Sttl Amt']) || 0,
            interchange_fee_amount: this.parseNumber(row['PSP Interchange Fee']) || 0,
            reconciliation_flag: null,
            transaction_status: row['Txn Status'],
            transaction_type: row['Txn Type'],
            psp_name: row['PSP Name'],
            payment_brand: row['Payment Brand'],
            card_number: row['Card Number'],
            authorization_code: row['PSP Authorization Code'],
            mcc: row['Store MCC'],
            crossborder_flag: row['Crossborder Flag'],
            group_id: row['Group ID'],
            group_name: row['Group Name'],
            merchant_id: merchantId,
            merchant_name: row['Merchant Name'],
            store_id: row['Store ID'],
            store_name: row['Store Name'],
            terminal_id: row['Terminal ID'] || null,
            source_filename: sourceFilename,
            merchant_nation: row['Merchant Nation'],
            merchant_city: row['Merchant City'],
            system_transaction_time: row['System Txn Time'],
            api_type: row['API Type'],
            payment_method_variant: row['Payment Method Variant'],
            funding_type: row['Funding Type'],
            product_id: row['Product ID'],
            product_type_id: row['Product Type ID'],
            issuer_country: row['Issuer Country'],
            merchant_order_reference: row['Merchant Order Reference'],
            system_transaction_id: systemTxnId,
            original_system_transaction_id: row['Original System Txn ID'],
            merchant_local_amount: this.parseNumber(row['Merchant Local Amt']) || 0,
            local_tips_amount: this.parseNumber(row['Local Tips Amt']) || 0,
            local_surcharge_fee_amount: this.parseNumber(row['Local Surcharge Fee Amt']) || 0,
            local_capture_amount: this.parseNumber(row['Local Capture Amt']) || 0,
            merchant_local_currency: row['Merchant Local Curr'],
            rate_local_to_transaction: this.parseNumber(row['Rate of Local to Txn']) || 0,
            surcharge_fee_amount: this.parseNumber(row['Surcharge Fee Amt']) || 0,
            merchant_capture_amount: this.parseNumber(row['Merchant Capture Amt']) || 0,
            merchant_discount_amount: this.parseNumber(row['Merchant Discount Amt']) || 0,
            rate_transaction_to_settlement: this.parseNumber(row['Rate from Merchant Txn to Sttl']) || 0,
            mdr_rules: row['MDR Rules'],
            psp_scheme_fee: this.parseNumber(row['PSP Scheme Fee']) || 0,
            acquirer_service_fee: this.parseNumber(row['Acquirer Service Fee']) || 0,
            transaction_service_fee: this.parseNumber(row['Txn Service Fee']) || 0,
            vat_amount: this.parseNumber(row['VAT Amount']) || 0,
            wht_amount: this.parseNumber(row['WHT Amount']) || 0,
            user_billing_amount: this.parseNumber(row['User Billing Amt']) || 0,
            user_billing_currency: row['User Billing Curr'],
            eci: row['ECI'],
            transaction_initiation_mode: row['Txn Initiation Mode'],
            linkpay_order_id: row['LinkPay Order ID'],
            system_result_code: row['System Result Code'],
            psp_result_code: row['PSP Result Code'],
            settlement_account_name: row['Settlement Account Name'],
            settlement_account_number: row['Settlement Account Number'],
            metadata: row['Metadata'] ? JSON.stringify({ raw: row['Metadata'] }) : null,
            api_code: row['API Type'] || 'STANDARD_API',
          };
          
          const result = await this.create(dto);
          results.push(result);
        } catch (error) {
          errors.push({
            row: i + 2,
            error: error.response?.message || error.message,
            details: error.response?.errors || null,
            status: error.status,
          });
        }
      }

      return {
        status: results.length > 0 ? 'success' : 'error',
        message: `Import completed. ${results.length} successful, ${errors.length} failed, ${skippedRows} skipped`,
        data: { 
          imported_count: results.length, 
          failed_count: errors.length,
          skipped_count: skippedRows,
          errors: errors
        },
        summary: {
          total_rows: csvData.length,
          successful_imports: results.length,
          failed_imports: errors.length,
          skipped_rows: skippedRows,
          errors: errors
        }
      };
    } catch (error) {
      console.error('Error importing CSV data:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to import CSV data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }

  async update(id: number, dto: UpdateSettlementDetailsDto): Promise<any> {
    try {
      const existingRecord = await this.dataSource.query(
        'SELECT id FROM settlement_details WHERE id = ?',
        [id],
      );

      if (existingRecord.length === 0) {
        throw new NotFoundException(`Settlement detail with ID ${id} not found`);
      }

      const updateFields: string[] = [];
      const params: any[] = [];

      Object.keys(dto).forEach((key) => {
        if (dto[key] !== undefined) {
          if (key.includes('time') && dto[key]) {
            updateFields.push(`${key} = ?`);
            params.push(this.formatDateTimeForMySQL(dto[key]));
          } else {
            updateFields.push(`${key} = ?`);
            params.push(dto[key]);
          }
        }
      });

      if (updateFields.length === 0) {
        throw new HttpException('No fields to update', HttpStatus.BAD_REQUEST);
      }

      updateFields.push('updated_at = NOW()');
      params.push(id);

      const query = `UPDATE settlement_details SET ${updateFields.join(', ')} WHERE id = ?`;
      
      await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: 'Settlement detail updated successfully',
        data: { id },
      };
    } catch (error) {
      console.error('Error updating settlement detail:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update settlement detail',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(dto: FindByIdDto): Promise<any> {
    try {
      const query = `SELECT * FROM settlement_details WHERE id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        throw new NotFoundException(`Settlement detail with ID ${dto.id} not found`);
      }

      return {
        status: 'success',
        message: 'Settlement detail found',
        data: result[0],
      };
    } catch (error) {
      console.error('Error fetching settlement detail by ID:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch settlement detail',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<any> {
    try {
      const existingRecord = await this.dataSource.query(
        'SELECT id FROM settlement_details WHERE id = ?',
        [id],
      );

      if (existingRecord.length === 0) {
        throw new NotFoundException(`Settlement detail with ID ${id} not found`);
      }

      await this.dataSource.query('DELETE FROM settlement_details WHERE id = ?', [id]);

      return {
        status: 'success',
        message: 'Settlement detail deleted successfully',
        data: { id },
      };
    } catch (error) {
      console.error('Error deleting settlement detail:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete settlement detail',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSummary(dto: GetSummaryDto): Promise<any> {
    try {
      let query = `
        SELECT 
          company_id,
          COUNT(*) as total_transactions,
          SUM(transaction_amount) as total_volume,
          SUM(mdr_amount) as total_mdr_fees,
          SUM(interchange_fee_amount) as total_interchange_fees,
          SUM(psp_scheme_fee) as total_scheme_fees,
          SUM(acquirer_service_fee) as total_acquirer_fees,
          SUM(transaction_service_fee) as total_service_fees,
          SUM(vat_amount) as total_vat,
          SUM(wht_amount) as total_wht,
          AVG(transaction_amount) as avg_transaction_size,
          COUNT(DISTINCT merchant_id) as unique_merchants,
          COUNT(DISTINCT terminal_id) as unique_terminals,
          COUNT(DISTINCT issuer_country) as unique_issuer_countries,
          COUNT(DISTINCT api_code) as unique_api_codes,
          COUNT(CASE WHEN crossborder_flag = 'International' THEN 1 END) as international_transactions,
          COUNT(CASE WHEN crossborder_flag = 'Domestic' THEN 1 END) as domestic_transactions,
          COUNT(CASE WHEN funding_type = 'Debit' THEN 1 END) as debit_transactions,
          COUNT(CASE WHEN funding_type = 'Credit' THEN 1 END) as credit_transactions,
          COUNT(CASE WHEN transaction_status = 'Success' THEN 1 END) as successful_transactions,
          COUNT(CASE WHEN transaction_status != 'Success' THEN 1 END) as failed_transactions
        FROM settlement_details 
        WHERE company_id = ?
      `;
      const params: any[] = [dto.company_id];

      if (dto.start_date && dto.end_date) {
        query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
        params.push(dto.start_date, dto.end_date);
      }

      query += ` GROUP BY company_id`;

      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: 'Settlement summary fetched successfully',
        data: result[0] || null,
      };
    } catch (error) {
      console.error('Error fetching settlement summary:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch settlement summary',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByStatus(dto: GetByStatusDto): Promise<any> {
    try {
      const query = `
        SELECT * FROM settlement_details 
        WHERE company_id = ? AND reconciliation_flag = ?
        ORDER BY transaction_time DESC
      `;
      
      const result = await this.dataSource.query(query, [dto.company_id, dto.reconciliation_flag]);

      return {
        status: 'success',
        message: `Transactions with status '${dto.reconciliation_flag}' fetched successfully`,
        data: result,
        count: result.length,
      };
    } catch (error) {
      console.error('Error fetching transactions by status:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch transactions by status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(filters?: {
    company_id?: number;
    start_date?: string;
    end_date?: string;
    transaction_type?: string;
    reconciliation_flag?: string;
    transaction_status?: string;
    funding_type?: string;
    crossborder_flag?: string;
    merchant_nation?: string;
    issuer_country?: string;
    payment_brand?: string;
    source_filename?: string;
    api_code?: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    try {
      let query = `SELECT * FROM settlement_details WHERE 1=1`;
      const params: any[] = [];

      if (filters?.company_id) {
        query += ` AND company_id = ?`;
        params.push(filters.company_id);
      }

      if (filters?.start_date && filters?.end_date) {
        query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
        params.push(filters.start_date, filters.end_date);
      }

      if (filters?.transaction_type) {
        query += ` AND transaction_type = ?`;
        params.push(filters.transaction_type);
      }

      if (filters?.reconciliation_flag) {
        query += ` AND reconciliation_flag = ?`;
        params.push(filters.reconciliation_flag);
      }

      if (filters?.transaction_status) {
        query += ` AND transaction_status = ?`;
        params.push(filters.transaction_status);
      }

      if (filters?.funding_type) {
        query += ` AND funding_type = ?`;
        params.push(filters.funding_type);
      }

      if (filters?.crossborder_flag) {
        query += ` AND crossborder_flag = ?`;
        params.push(filters.crossborder_flag);
      }

      if (filters?.merchant_nation) {
        query += ` AND merchant_nation = ?`;
        params.push(filters.merchant_nation);
      }

      if (filters?.issuer_country) {
        query += ` AND issuer_country = ?`;
        params.push(filters.issuer_country);
      }

      if (filters?.payment_brand) {
        query += ` AND payment_brand = ?`;
        params.push(filters.payment_brand);
      }

      if (filters?.source_filename) {
        query += ` AND source_filename = ?`;
        params.push(filters.source_filename);
      }

      if (filters?.api_code) {
        query += ` AND api_code = ?`;
        params.push(filters.api_code);
      }

      query += ` ORDER BY transaction_time DESC`;

      if (filters?.limit) {
        query += ` LIMIT ?`;
        params.push(filters.limit);
        
        if (filters?.offset) {
          query += ` OFFSET ?`;
          params.push(filters.offset);
        }
      }

      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: 'Settlement details fetched successfully',
        data: result,
        count: result.length,
      };
    } catch (error) {
      console.error('Error fetching settlement details:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch settlement details',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBySourceFile(company_id: number, source_filename: string): Promise<any> {
    try {
      const query = `
        SELECT * FROM settlement_details 
        WHERE company_id = ? AND source_filename = ?
        ORDER BY datetime_upload DESC, transaction_time DESC
      `;
      
      const result = await this.dataSource.query(query, [company_id, source_filename]);

      return {
        status: 'success',
        message: `Transactions from file '${source_filename}' fetched successfully`,
        data: result,
        count: result.length,
      };
    } catch (error) {
      console.error('Error fetching transactions by source file:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch transactions by source file',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByApiCode(company_id: number, api_code: string): Promise<any> {
    try {
      const query = `
        SELECT * FROM settlement_details 
        WHERE company_id = ? AND api_code = ?
        ORDER BY transaction_time DESC
      `;
      
      const result = await this.dataSource.query(query, [company_id, api_code]);

      return {
        status: 'success',
        message: `Transactions with API code '${api_code}' fetched successfully`,
        data: result,
        count: result.length,
      };
    } catch (error) {
      console.error('Error fetching transactions by API code:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch transactions by API code',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getApiCodeStats(company_id: number, filters?: {
    start_date?: string;
    end_date?: string;
  }): Promise<any> {
    try {
      let query = `
        SELECT 
          api_code,
          COUNT(*) as transaction_count,
          SUM(transaction_amount) as total_volume,
          AVG(transaction_amount) as avg_transaction_size,
          COUNT(CASE WHEN transaction_status = 'Success' THEN 1 END) as successful_transactions,
          COUNT(CASE WHEN transaction_status != 'Success' THEN 1 END) as failed_transactions,
          (COUNT(CASE WHEN transaction_status = 'Success' THEN 1 END) * 100.0 / COUNT(*)) as success_rate
        FROM settlement_details 
        WHERE company_id = ?
      `;
      const params: any[] = [company_id];

      if (filters?.start_date && filters?.end_date) {
        query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
        params.push(filters.start_date, filters.end_date);
      }

      query += ` GROUP BY api_code ORDER BY transaction_count DESC`;

      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: 'API code statistics fetched successfully',
        data: result,
        count: result.length,
      };
    } catch (error) {
      console.error('Error fetching API code statistics:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch API code statistics',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBySystemTransactionIds(
    company_id: number,
    system_transaction_ids: string[],
  ): Promise<any[]> {
    try {
      if (!system_transaction_ids || system_transaction_ids.length === 0) {
        return [];
      }

      // Create placeholders for the IN clause
      const placeholders = system_transaction_ids.map(() => '?').join(',');
      
      const query = `
        SELECT system_transaction_id 
        FROM settlement_details 
        WHERE company_id = ? 
        AND system_transaction_id IN (${placeholders})
      `;
      
      const params = [company_id, ...system_transaction_ids];
      
      console.log(`Querying duplicates: company_id=${company_id}, checking ${system_transaction_ids.length} IDs`);
      
      const result = await this.dataSource.query(query, params);
      
      console.log(`Found ${result.length} existing records in database`);
      
      return result;
    } catch (error) {
      console.error('Error checking duplicate system transaction IDs:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to query system transaction IDs',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}