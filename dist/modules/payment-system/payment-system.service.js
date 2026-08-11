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
exports.PaymentSystemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let PaymentSystemService = class PaymentSystemService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    formatDateTimeForMySQL(isoDateTime) {
        if (!isoDateTime)
            return null;
        return new Date(isoDateTime).toISOString().slice(0, 19).replace('T', ' ');
    }
    async createAcquirerSettlement(dto) {
        try {
            const query = `
        INSERT INTO tb_acquirer_settlement (
          psp_id, psp_name, group_id, group_name, merchant_id, merchant_name,
          store_id, store_name, store_mcc, terminal_id, merchant_nation, merchant_city,
          merchant_txn_time, system_txn_time, txn_pay_time, api_type, txn_type,
          payment_brand, payment_method_variant, merchant_txn_id, merchant_order_reference,
          system_txn_id, psp_txn_id, original_merchant_txn_id, original_system_txn_id,
          original_psp_txn_id, card_number, funding_type, product_id, product_type_id,
          issuer_country, merchant_local_amt, local_tips_amt, local_surcharge_fee_amt,
          local_capture_amt, merchant_local_curr, rate_of_local_to_txn, merchant_txn_amt,
          tips_amount, surcharge_fee_amt, merchant_capture_amt, merchant_txn_curr,
          user_billing_amt, user_billing_curr, eci, txn_initiation_mode, linkpay_order_id,
          txn_status, system_result_code, psp_result_code, psp_authorization_code,
          crossborder_flag, merchant_sttl_amt, merchant_discount_amt, merchant_sttl_curr,
          rate_from_merchant_txn_to_sttl, mdr_rules, mdr_amount, psp_scheme_fee,
          acquirer_service_fee, txn_service_fee, vat_amount, wht_amount,
          net_merchant_sttl_amt, psp_interchange_fee, metadata, settlement_account_name,
          settlement_account_number, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
            const params = [
                dto.psp_id || null,
                dto.psp_name || null,
                dto.group_id || null,
                dto.group_name || null,
                dto.merchant_id || null,
                dto.merchant_name || null,
                dto.store_id || null,
                dto.store_name || null,
                dto.store_mcc || null,
                dto.terminal_id || null,
                dto.merchant_nation || null,
                dto.merchant_city || null,
                this.formatDateTimeForMySQL(dto.merchant_txn_time),
                this.formatDateTimeForMySQL(dto.system_txn_time),
                this.formatDateTimeForMySQL(dto.txn_pay_time),
                dto.api_type || null,
                dto.txn_type || null,
                dto.payment_brand || null,
                dto.payment_method_variant || null,
                dto.merchant_txn_id || null,
                dto.merchant_order_reference || null,
                dto.system_txn_id,
                dto.psp_txn_id || null,
                dto.original_merchant_txn_id || null,
                dto.original_system_txn_id || null,
                dto.original_psp_txn_id || null,
                dto.card_number || null,
                dto.funding_type || null,
                dto.product_id || null,
                dto.product_type_id || null,
                dto.issuer_country || null,
                dto.merchant_local_amt || null,
                dto.local_tips_amt || null,
                dto.local_surcharge_fee_amt || null,
                dto.local_capture_amt || null,
                dto.merchant_local_curr || null,
                dto.rate_of_local_to_txn || null,
                dto.merchant_txn_amt || null,
                dto.tips_amount || null,
                dto.surcharge_fee_amt || null,
                dto.merchant_capture_amt || null,
                dto.merchant_txn_curr || null,
                dto.user_billing_amt || null,
                dto.user_billing_curr || null,
                dto.eci || null,
                dto.txn_initiation_mode || null,
                dto.linkpay_order_id || null,
                dto.txn_status || null,
                dto.system_result_code || null,
                dto.psp_result_code || null,
                dto.psp_authorization_code || null,
                dto.crossborder_flag || null,
                dto.merchant_sttl_amt || null,
                dto.merchant_discount_amt || null,
                dto.merchant_sttl_curr || null,
                dto.rate_from_merchant_txn_to_sttl || null,
                dto.mdr_rules || null,
                dto.mdr_amount || null,
                dto.psp_scheme_fee || null,
                dto.acquirer_service_fee || null,
                dto.txn_service_fee || null,
                dto.vat_amount || null,
                dto.wht_amount || null,
                dto.net_merchant_sttl_amt || null,
                dto.psp_interchange_fee || null,
                dto.metadata || null,
                dto.settlement_account_name || null,
                dto.settlement_account_number || null
            ];
            console.log(`Insert query now has 68 columns (including created_at, updated_at)`);
            console.log(`Params array has ${params.length} values`);
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Acquirer settlement record created successfully',
                data: { system_txn_id: dto.system_txn_id }
            };
        }
        catch (error) {
            console.error('Error creating acquirer settlement:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create acquirer settlement record',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAcquirerSettlements(filters = {}) {
        try {
            let query = `SELECT * FROM tb_acquirer_settlement WHERE 1=1`;
            const params = [];
            if (filters.merchant_id) {
                query += ` AND merchant_id = ?`;
                params.push(filters.merchant_id);
            }
            if (filters.start_date && filters.end_date) {
                query += ` AND DATE(merchant_txn_time) BETWEEN ? AND ?`;
                params.push(filters.start_date, filters.end_date);
            }
            if (filters.transaction_status) {
                query += ` AND txn_status = ?`;
                params.push(filters.transaction_status);
            }
            if (filters.payment_brand) {
                query += ` AND payment_brand = ?`;
                params.push(filters.payment_brand);
            }
            query += ` ORDER BY merchant_txn_time DESC`;
            if (filters.limit) {
                query += ` LIMIT ?`;
                params.push(filters.limit);
                if (filters.offset) {
                    query += ` OFFSET ?`;
                    params.push(filters.offset);
                }
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Acquirer settlement records retrieved successfully',
                data: result,
                count: result.length
            };
        }
        catch (error) {
            console.error('Error retrieving acquirer settlements:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to retrieve acquirer settlement records',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createPspReconciliation(dto) {
        try {
            const query = `
        INSERT INTO tb_psp_reconciliation (
          acquirer_id, acquirer_name, psp_id, psp_name, group_id, group_name,
          merchant_id, merchant_name, store_id, store_name, store_mcc, terminal_id,
          merchant_nation, merchant_city, merchant_txn_time, system_txn_time, txn_pay_time,
          api_type, txn_type, payment_brand, payment_method_variant, merchant_txn_id,
          merchant_order_reference, system_txn_id, psp_txn_id, original_merchant_txn_id,
          original_system_txn_id, original_psp_txn_id, psp_arn, psp_settlement_date,
          card_number, funding_type, product_id, product_type_id, issuer_country,
          merchant_local_amt, local_tips_amt, local_surcharge_fee_amt, local_capture_amt,
          merchant_local_curr, rate_of_local_to_txn, merchant_txn_amt, tips_amount,
          surcharge_fee_amt, merchant_capture_amt, merchant_txn_curr, psp_txn_amt,
          psp_txn_curr, direct_fx_rate, user_billing_amt, user_billing_curr, eci,
          txn_initiation_mode, linkpay_order_id, txn_status, system_result_code,
          psp_result_code, psp_authorization_code, crossborder_flag, psp_sttl_amt,
          psp_discount_amt, acquirer_discount_amt, psp_sttl_curr, rate_for_psp_txn_to_sttl,
          psp_vat_amount, psp_wht_amount, psp_net_sttl_amt, psp_interchange_fee,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
            const params = [
                dto.acquirer_id || null, dto.acquirer_name || null, dto.psp_id || null, dto.psp_name || null, dto.group_id || null, dto.group_name || null,
                dto.merchant_id || null, dto.merchant_name || null, dto.store_id || null, dto.store_name || null, dto.store_mcc || null, dto.terminal_id || null,
                dto.merchant_nation || null, dto.merchant_city || null, this.formatDateTimeForMySQL(dto.merchant_txn_time),
                this.formatDateTimeForMySQL(dto.system_txn_time), this.formatDateTimeForMySQL(dto.txn_pay_time),
                dto.api_type || null, dto.txn_type || null, dto.payment_brand || null, dto.payment_method_variant || null, dto.merchant_txn_id || null,
                dto.merchant_order_reference || null, dto.system_txn_id, dto.psp_txn_id || null, dto.original_merchant_txn_id || null,
                dto.original_system_txn_id || null, dto.original_psp_txn_id || null, dto.psp_arn || null, dto.psp_settlement_date || null,
                dto.card_number || null, dto.funding_type || null, dto.product_id || null, dto.product_type_id || null, dto.issuer_country || null,
                dto.merchant_local_amt || null, dto.local_tips_amt || null, dto.local_surcharge_fee_amt || null, dto.local_capture_amt || null,
                dto.merchant_local_curr || null, dto.rate_of_local_to_txn || null, dto.merchant_txn_amt || null, dto.tips_amount || null,
                dto.surcharge_fee_amt || null, dto.merchant_capture_amt || null, dto.merchant_txn_curr || null, dto.psp_txn_amt || null,
                dto.psp_txn_curr || null, dto.direct_fx_rate || null, dto.user_billing_amt || null, dto.user_billing_curr || null, dto.eci || null,
                dto.txn_initiation_mode || null, dto.linkpay_order_id || null, dto.txn_status || null, dto.system_result_code || null,
                dto.psp_result_code || null, dto.psp_authorization_code || null, dto.crossborder_flag || null, dto.psp_sttl_amt || null,
                dto.psp_discount_amt || null, dto.acquirer_discount_amt || null, dto.psp_sttl_curr || null, dto.rate_for_psp_txn_to_sttl || null,
                dto.psp_vat_amount || null, dto.psp_wht_amount || null, dto.psp_net_sttl_amt || null, dto.psp_interchange_fee || null
            ];
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'PSP reconciliation record created successfully',
                data: { system_txn_id: dto.system_txn_id }
            };
        }
        catch (error) {
            console.error('Error creating PSP reconciliation:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create PSP reconciliation record',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPspReconciliations(filters = {}) {
        try {
            let query = `SELECT * FROM tb_psp_reconciliation WHERE 1=1`;
            const params = [];
            if (filters.merchant_id) {
                query += ` AND merchant_id = ?`;
                params.push(filters.merchant_id);
            }
            if (filters.start_date && filters.end_date) {
                query += ` AND DATE(merchant_txn_time) BETWEEN ? AND ?`;
                params.push(filters.start_date, filters.end_date);
            }
            if (filters.transaction_status) {
                query += ` AND txn_status = ?`;
                params.push(filters.transaction_status);
            }
            if (filters.payment_brand) {
                query += ` AND payment_brand = ?`;
                params.push(filters.payment_brand);
            }
            query += ` ORDER BY merchant_txn_time DESC`;
            if (filters.limit) {
                query += ` LIMIT ?`;
                params.push(filters.limit);
                if (filters.offset) {
                    query += ` OFFSET ?`;
                    params.push(filters.offset);
                }
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'PSP reconciliation records retrieved successfully',
                data: result,
                count: result.length
            };
        }
        catch (error) {
            console.error('Error retrieving PSP reconciliations:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to retrieve PSP reconciliation records',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createSettlementSummary(dto) {
        try {
            const query = `
        INSERT INTO tb_settlement_summary (
          transaction_time, payment_time, terminal_settlement_time, order_number,
          psp_order_number, original_order_number, original_psp_order_number,
          transaction_amount, tips_amount, transaction_currency, transaction_type,
          merchant_settlement_amount, merchant_settlement_currency, mdr_amount,
          net_merchant_settlement_amount, brand_settlement_amount, brand_settlement_currency,
          interchange_fee_amount, net_brand_settlement_amount, reconciliation_flag,
          psp_name, payment_brand, crossboarder_flag, card_number, authorization_code,
          mcc, group_id, group_name, merchant_id, merchant_name, store_id, store_name,
          terminal_id, batch_number, terminal_trace_number, remark
        ) VALUES (${Array(36).fill('?').join(', ')})
      `;
            const params = [
                this.formatDateTimeForMySQL(dto.transaction_time), this.formatDateTimeForMySQL(dto.payment_time),
                this.formatDateTimeForMySQL(dto.terminal_settlement_time), dto.order_number, dto.psp_order_number,
                dto.original_order_number, dto.original_psp_order_number, dto.transaction_amount, dto.tips_amount,
                dto.transaction_currency, dto.transaction_type, dto.merchant_settlement_amount,
                dto.merchant_settlement_currency, dto.mdr_amount, dto.net_merchant_settlement_amount,
                dto.brand_settlement_amount, dto.brand_settlement_currency, dto.interchange_fee_amount,
                dto.net_brand_settlement_amount, dto.reconciliation_flag, dto.psp_name, dto.payment_brand,
                dto.crossboarder_flag, dto.card_number, dto.authorization_code, dto.mcc, dto.group_id,
                dto.group_name, dto.merchant_id, dto.merchant_name, dto.store_id, dto.store_name,
                dto.terminal_id, dto.batch_number, dto.terminal_trace_number, dto.remark
            ];
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Settlement summary record created successfully',
                data: { order_number: dto.order_number, terminal_id: dto.terminal_id }
            };
        }
        catch (error) {
            console.error('Error creating settlement summary:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create settlement summary record',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSettlementSummaries(filters = {}) {
        try {
            let query = `SELECT * FROM tb_settlement_summary WHERE 1=1`;
            const params = [];
            if (filters.merchant_id) {
                query += ` AND merchant_id = ?`;
                params.push(filters.merchant_id);
            }
            if (filters.start_date && filters.end_date) {
                query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
                params.push(filters.start_date, filters.end_date);
            }
            if (filters.payment_brand) {
                query += ` AND payment_brand = ?`;
                params.push(filters.payment_brand);
            }
            query += ` ORDER BY transaction_time DESC`;
            if (filters.limit) {
                query += ` LIMIT ?`;
                params.push(filters.limit);
                if (filters.offset) {
                    query += ` OFFSET ?`;
                    params.push(filters.offset);
                }
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Settlement summary records retrieved successfully',
                data: result,
                count: result.length
            };
        }
        catch (error) {
            console.error('Error retrieving settlement summaries:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to retrieve settlement summary records',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTransactionDetails(dto) {
        try {
            const query = `
        INSERT INTO tb_transaction_details (
          no_seq, transaction_type, order_number_rrn, original_order_number_rrn,
          card_number_summary, acquirer_id, acquirer_name, group_id, group_name,
          merchant_id, merchant_name, store_id, store_name, payment_brand,
          mdr_amount, transaction_amount, transaction_currency, transaction_status,
          mdr, creation_time, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
            const params = [
                dto.no_seq || null, dto.transaction_type || null, dto.order_number_rrn, dto.original_order_number_rrn || null,
                dto.card_number_summary || null, dto.acquirer_id || null, dto.acquirer_name || null, dto.group_id || null, dto.group_name || null,
                dto.merchant_id || null, dto.merchant_name || null, dto.store_id || null, dto.store_name || null, dto.payment_brand || null,
                dto.mdr_amount || null, dto.transaction_amount || null, dto.transaction_currency || null, dto.transaction_status || null,
                dto.mdr || null, this.formatDateTimeForMySQL(dto.creation_time)
            ];
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Transaction details record created successfully',
                data: { order_number_rrn: dto.order_number_rrn }
            };
        }
        catch (error) {
            console.error('Error creating transaction details:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create transaction details record',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTransactionDetails(filters = {}) {
        try {
            let query = `SELECT * FROM tb_transaction_details WHERE 1=1`;
            const params = [];
            if (filters.merchant_id) {
                query += ` AND merchant_id = ?`;
                params.push(filters.merchant_id);
            }
            if (filters.start_date && filters.end_date) {
                query += ` AND DATE(creation_time) BETWEEN ? AND ?`;
                params.push(filters.start_date, filters.end_date);
            }
            if (filters.transaction_status) {
                query += ` AND transaction_status = ?`;
                params.push(filters.transaction_status);
            }
            if (filters.payment_brand) {
                query += ` AND payment_brand = ?`;
                params.push(filters.payment_brand);
            }
            query += ` ORDER BY creation_time DESC`;
            if (filters.limit) {
                query += ` LIMIT ?`;
                params.push(filters.limit);
                if (filters.offset) {
                    query += ` OFFSET ?`;
                    params.push(filters.offset);
                }
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Transaction details records retrieved successfully',
                data: result,
                count: result.length
            };
        }
        catch (error) {
            console.error('Error retrieving transaction details:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to retrieve transaction details records',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async importAcquirerSettlementCSV(csvData) {
        try {
            const results = [];
            const errors = [];
            for (let i = 0; i < csvData.length; i++) {
                try {
                    const row = csvData[i];
                    const dto = {
                        psp_id: row['PSP ID']?.toString(),
                        psp_name: row['PSP Name'],
                        group_id: row['Group ID'],
                        group_name: row['Group Name'],
                        merchant_id: row['Merchant ID'],
                        merchant_name: row['Merchant Name'],
                        store_id: row['Store ID'],
                        store_name: row['Store Name'],
                        store_mcc: row['Store MCC']?.toString(),
                        terminal_id: row['Terminal ID']?.toString(),
                        merchant_nation: row['Merchant Nation'],
                        merchant_city: row['Merchant City'],
                        merchant_txn_time: row['Merchant Txn Time'],
                        system_txn_time: row['System Txn Time'],
                        txn_pay_time: row['Txn Pay Time'],
                        api_type: row['API Type'],
                        txn_type: row['Txn Type'],
                        payment_brand: row['Payment Brand'],
                        payment_method_variant: row['Payment Method Variant'],
                        merchant_txn_id: row['Merchant Txn ID']?.toString(),
                        merchant_order_reference: row['Merchant Order Reference'],
                        system_txn_id: row['System Txn ID'],
                        psp_txn_id: row['PSP Txn ID']?.toString(),
                        original_merchant_txn_id: row['Original Merchant Txn ID']?.toString(),
                        original_system_txn_id: row['Original System Txn ID'],
                        original_psp_txn_id: row['Original PSP Txn ID']?.toString(),
                        card_number: row['Card Number'],
                        funding_type: row['Funding Type'],
                        product_id: row['Product ID'],
                        product_type_id: row['Product Type ID'],
                        issuer_country: row['Issuer Country'],
                        merchant_local_amt: parseFloat(row['Merchant Local Amt']) || null,
                        local_tips_amt: parseFloat(row['Local Tips Amt']) || null,
                        local_surcharge_fee_amt: parseFloat(row['Local Surcharge Fee Amt']) || null,
                        local_capture_amt: parseFloat(row['Local Capture Amt']) || null,
                        merchant_local_curr: row['Merchant Local Curr'],
                        rate_of_local_to_txn: parseFloat(row['Rate of Local to Txn']) || null,
                        merchant_txn_amt: parseFloat(row['Merchant Txn Amt']) || null,
                        tips_amount: parseFloat(row['Tips Amount']) || null,
                        surcharge_fee_amt: parseFloat(row['Surcharge Fee Amt']) || null,
                        merchant_capture_amt: parseFloat(row['Merchant Capture Amt']) || null,
                        merchant_txn_curr: row['Merchant Txn Curr'],
                        user_billing_amt: parseFloat(row['User Billing Amt']) || null,
                        user_billing_curr: row['User Billing Curr'],
                        eci: row['ECI'],
                        txn_initiation_mode: row['Txn Initiation Mode'],
                        linkpay_order_id: row['LinkPay Order ID'],
                        txn_status: row['Txn Status'],
                        system_result_code: row['System Result Code'],
                        psp_result_code: row['PSP Result Code']?.toString(),
                        psp_authorization_code: row['PSP Authorization Code'],
                        crossborder_flag: row['Crossborder Flag'],
                        merchant_sttl_amt: parseFloat(row['Merchant Sttl Amt']) || null,
                        merchant_discount_amt: parseFloat(row['Merchant Discount Amt']) || null,
                        merchant_sttl_curr: row['Merchant Sttl Curr'],
                        rate_from_merchant_txn_to_sttl: parseFloat(row['Rate from Merchant Txn to Sttl']) || null,
                        mdr_rules: row['MDR Rules'],
                        mdr_amount: parseFloat(row['MDR Amount']) || null,
                        psp_scheme_fee: parseFloat(row['PSP Scheme Fee']) || null,
                        acquirer_service_fee: parseFloat(row['Acquirer Service Fee']) || null,
                        txn_service_fee: parseFloat(row['Txn Service Fee']) || null,
                        vat_amount: parseFloat(row['VAT Amount']) || null,
                        wht_amount: parseFloat(row['WHT Amount']) || null,
                        net_merchant_sttl_amt: parseFloat(row['Net Merchant Sttl Amt']) || null,
                        psp_interchange_fee: parseFloat(row['PSP Interchange Fee']) || null,
                        metadata: row['Metadata'],
                        settlement_account_name: row['Settlement Account Name'],
                        settlement_account_number: row['Settlement Account Number']?.toString()
                    };
                    const result = await this.createAcquirerSettlement(dto);
                    results.push(result);
                }
                catch (error) {
                    errors.push(`Row ${i + 1}: ${error.message}`);
                }
            }
            return {
                status: results.length > 0 ? 'success' : 'error',
                message: `Acquirer settlement import completed. ${results.length} successful, ${errors.length} failed`,
                data: {
                    imported_count: results.length,
                    failed_count: errors.length,
                    errors: errors.slice(0, 10)
                }
            };
        }
        catch (error) {
            console.error('Error importing acquirer settlement CSV:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to import acquirer settlement CSV data',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async importPspReconciliationCSV(csvData) {
        try {
            const results = [];
            const errors = [];
            for (let i = 0; i < csvData.length; i++) {
                try {
                    const row = csvData[i];
                    const dto = {
                        acquirer_id: row['Acquirer ID']?.toString(),
                        acquirer_name: row['Acquirer Name'],
                        psp_id: row['PSP ID']?.toString(),
                        psp_name: row['PSP Name'],
                        group_id: row['Group ID'],
                        group_name: row['Group Name'],
                        merchant_id: row['Merchant ID'],
                        merchant_name: row['Merchant Name'],
                        store_id: row['Store ID'],
                        store_name: row['Store Name'],
                        store_mcc: row['Store MCC']?.toString(),
                        terminal_id: row['Terminal ID']?.toString(),
                        merchant_nation: row['Merchant Nation'],
                        merchant_city: row['Merchant City'],
                        merchant_txn_time: row['Merchant Txn Time'],
                        system_txn_time: row['System Txn Time'],
                        txn_pay_time: row['Txn Pay Time'],
                        api_type: row['API Type'],
                        txn_type: row['Txn Type'],
                        payment_brand: row['Payment Brand'],
                        payment_method_variant: row['Payment Method Variant'],
                        merchant_txn_id: row['Merchant Txn ID']?.toString(),
                        merchant_order_reference: row['Merchant Order Reference'],
                        system_txn_id: row['System Txn ID'],
                        psp_txn_id: row['PSP Txn ID']?.toString(),
                        original_merchant_txn_id: row['Original Merchant Txn ID']?.toString(),
                        original_system_txn_id: row['Original System Txn ID'],
                        original_psp_txn_id: row['Original PSP Txn ID']?.toString(),
                        psp_arn: row['PSP ARN'],
                        psp_settlement_date: row['PSP Settlement Date'],
                        card_number: row['Card Number'],
                        funding_type: row['Funding Type'],
                        product_id: row['Product ID'],
                        product_type_id: row['Product Type ID'],
                        issuer_country: row['Issuer Country'],
                        merchant_local_amt: parseFloat(row['Merchant Local Amt']) || null,
                        local_tips_amt: parseFloat(row['Local Tips Amt']) || null,
                        local_surcharge_fee_amt: parseFloat(row['Local Surcharge Fee Amt']) || null,
                        local_capture_amt: parseFloat(row['Local Capture Amt']) || null,
                        merchant_local_curr: row['Merchant Local Curr'],
                        rate_of_local_to_txn: parseFloat(row['Rate of Local to Txn']) || null,
                        merchant_txn_amt: parseFloat(row['Merchant Txn Amt']) || null,
                        tips_amount: parseFloat(row['Tips Amount']) || null,
                        surcharge_fee_amt: parseFloat(row['Surcharge Fee Amt']) || null,
                        merchant_capture_amt: parseFloat(row['Merchant Capture Amt']) || null,
                        merchant_txn_curr: row['Merchant Txn Curr'],
                        psp_txn_amt: parseFloat(row['PSP Txn Amt']) || null,
                        psp_txn_curr: row['PSP Txn Curr'],
                        direct_fx_rate: parseFloat(row['Direct FX Rate']) || null,
                        user_billing_amt: parseFloat(row['User Billing Amt']) || null,
                        user_billing_curr: row['User Billing Curr'],
                        eci: row['ECI'],
                        txn_initiation_mode: row['Txn Initiation Mode'],
                        linkpay_order_id: row['LinkPay Order ID'],
                        txn_status: row['Txn Status'],
                        system_result_code: row['System Result Code'],
                        psp_result_code: row['PSP Result Code']?.toString(),
                        psp_authorization_code: row['PSP Authorization Code'],
                        crossborder_flag: row['Crossborder Flag'],
                        psp_sttl_amt: parseFloat(row['PSP Sttl Amt']) || null,
                        psp_discount_amt: parseFloat(row['PSP Discount Amt']) || null,
                        acquirer_discount_amt: parseFloat(row['Acquirer Discount Amt']) || null,
                        psp_sttl_curr: row['PSP Sttl Curr'],
                        rate_for_psp_txn_to_sttl: parseFloat(row['Rate for PSP TXN to Sttl']) || null,
                        psp_vat_amount: parseFloat(row['PSP VAT Amount']) || null,
                        psp_wht_amount: parseFloat(row['PSP WHT Amount']) || null,
                        psp_net_sttl_amt: parseFloat(row['PSP Net Sttl Amt']) || null,
                        psp_interchange_fee: parseFloat(row['PSP Interchange Fee']) || null
                    };
                    const result = await this.createPspReconciliation(dto);
                    results.push(result);
                }
                catch (error) {
                    errors.push(`Row ${i + 1}: ${error.message}`);
                }
            }
            return {
                status: results.length > 0 ? 'success' : 'error',
                message: `PSP reconciliation import completed. ${results.length} successful, ${errors.length} failed`,
                data: {
                    imported_count: results.length,
                    failed_count: errors.length,
                    errors: errors.slice(0, 10)
                }
            };
        }
        catch (error) {
            console.error('Error importing PSP reconciliation CSV:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to import PSP reconciliation CSV data',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async importSettlementSummaryCSV(csvData) {
        try {
            const results = [];
            const errors = [];
            for (let i = 0; i < csvData.length; i++) {
                try {
                    const row = csvData[i];
                    const dto = {
                        transaction_time: row['Transaction Time'],
                        payment_time: row['Payment Time'],
                        terminal_settlement_time: row['Terminal Settlement Time'],
                        order_number: row['Order Number']?.toString(),
                        psp_order_number: row['PSP Order Number']?.toString(),
                        original_order_number: row['Original Order Number']?.toString(),
                        original_psp_order_number: row['Original PSP Order Number']?.toString(),
                        transaction_amount: parseFloat(row['Transaction Amount']) || null,
                        tips_amount: parseFloat(row['Tips Amount']) || null,
                        transaction_currency: row['Transaction Currency'],
                        transaction_type: row['Transaction Type'],
                        merchant_settlement_amount: parseFloat(row['Merchant Settlement Amount']) || null,
                        merchant_settlement_currency: row['Merchant Settlement Currency'],
                        mdr_amount: parseFloat(row['MDR Amount']) || null,
                        net_merchant_settlement_amount: parseFloat(row['Net Merchant Settlement Amount']) || null,
                        brand_settlement_amount: parseFloat(row['Brand Settlement Amount']) || null,
                        brand_settlement_currency: row['Brand Settlement Currency'],
                        interchange_fee_amount: parseFloat(row['Interchange Fee Amount']) || null,
                        net_brand_settlement_amount: parseFloat(row['Net Brand Settlement Amount']) || null,
                        reconciliation_flag: row['Reconciliation Flag'],
                        psp_name: row['PSP Name'],
                        payment_brand: row['Payment Brand'],
                        crossboarder_flag: row['Crossboarder Flag'],
                        card_number: row['Card Number'],
                        authorization_code: row['Authorization Code']?.toString(),
                        mcc: row['MCC']?.toString(),
                        group_id: row['Group ID'],
                        group_name: row['Group Name'],
                        merchant_id: row['Merchant ID'],
                        merchant_name: row['Merchant Name'],
                        store_id: row['Store ID'],
                        store_name: row['Store Name'],
                        terminal_id: row['Terminal ID']?.toString(),
                        batch_number: row['Batch Number']?.toString(),
                        terminal_trace_number: row['Terminal Trace Number']?.toString(),
                        remark: row['Remark']
                    };
                    const result = await this.createSettlementSummary(dto);
                    results.push(result);
                }
                catch (error) {
                    errors.push(`Row ${i + 1}: ${error.message}`);
                }
            }
            return {
                status: results.length > 0 ? 'success' : 'error',
                message: `Settlement summary import completed. ${results.length} successful, ${errors.length} failed`,
                data: {
                    imported_count: results.length,
                    failed_count: errors.length,
                    errors: errors.slice(0, 10)
                }
            };
        }
        catch (error) {
            console.error('Error importing settlement summary CSV:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to import settlement summary CSV data',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async importTransactionDetailsCSV(csvData) {
        try {
            const results = [];
            const errors = [];
            for (let i = 0; i < csvData.length; i++) {
                try {
                    const row = csvData[i];
                    const dto = {
                        no_seq: row['No.']?.toString(),
                        transaction_type: row['Transaction Type'],
                        order_number_rrn: row['Order Number/RRN']?.toString(),
                        original_order_number_rrn: row['Orignal Order Number/RRN']?.toString(),
                        card_number_summary: row['Card Number Summary']?.toString(),
                        acquirer_id: row['Acquirer ID']?.toString(),
                        acquirer_name: row['Acquirer Name'],
                        group_id: row['Group ID'],
                        group_name: row['Group Name'],
                        merchant_id: row['Merchant ID'],
                        merchant_name: row['Merchant Name'],
                        store_id: row['Store ID'],
                        store_name: row['Store Name'],
                        payment_brand: row['Payment Brand'],
                        mdr_amount: row['MDR Amount']?.toString(),
                        transaction_amount: row['Transaction Amount']?.toString(),
                        transaction_currency: row['Transaction Currency'],
                        transaction_status: row['Transaction Status'],
                        mdr: row['MDR']?.toString(),
                        creation_time: row['Creation Time']
                    };
                    const result = await this.createTransactionDetails(dto);
                    results.push(result);
                }
                catch (error) {
                    errors.push(`Row ${i + 1}: ${error.message}`);
                }
            }
            return {
                status: results.length > 0 ? 'success' : 'error',
                message: `Transaction details import completed. ${results.length} successful, ${errors.length} failed`,
                data: {
                    imported_count: results.length,
                    failed_count: errors.length,
                    errors: errors.slice(0, 10)
                }
            };
        }
        catch (error) {
            console.error('Error importing transaction details CSV:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to import transaction details CSV data',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getReconciliationReport(filters = {}) {
        try {
            let query = `
        SELECT 
          source_type,
          COUNT(*) as total_transactions,
          SUM(CASE WHEN transaction_amount IS NOT NULL THEN transaction_amount ELSE 0 END) as total_volume,
          SUM(CASE WHEN net_settlement_amount IS NOT NULL THEN net_settlement_amount ELSE 0 END) as total_settlement,
          AVG(CASE WHEN transaction_amount IS NOT NULL THEN transaction_amount ELSE NULL END) as avg_transaction_size,
          COUNT(DISTINCT merchant_id) as unique_merchants,
          COUNT(CASE WHEN status = 'Success' THEN 1 END) as successful_transactions,
          COUNT(CASE WHEN status != 'Success' AND status IS NOT NULL THEN 1 END) as failed_transactions
        FROM vw_complete_reconciliation 
        WHERE 1=1
      `;
            const params = [];
            if (filters.merchant_id) {
                query += ` AND merchant_id = ?`;
                params.push(filters.merchant_id);
            }
            if (filters.start_date && filters.end_date) {
                query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
                params.push(filters.start_date, filters.end_date);
            }
            if (filters.payment_brand) {
                query += ` AND payment_brand = ?`;
                params.push(filters.payment_brand);
            }
            query += ` GROUP BY source_type ORDER BY total_volume DESC`;
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Reconciliation report generated successfully',
                data: result,
                summary: {
                    total_sources: result.length,
                    grand_total_volume: result.reduce((sum, row) => sum + parseFloat(row.total_volume || 0), 0),
                    grand_total_transactions: result.reduce((sum, row) => sum + parseInt(row.total_transactions || 0), 0)
                }
            };
        }
        catch (error) {
            console.error('Error generating reconciliation report:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to generate reconciliation report',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDailySummary(filters = {}) {
        try {
            let query = `
        SELECT 
          DATE(transaction_time) as transaction_date,
          source_type,
          COUNT(*) as daily_transactions,
          SUM(CASE WHEN transaction_amount IS NOT NULL THEN transaction_amount ELSE 0 END) as daily_volume,
          COUNT(DISTINCT merchant_id) as daily_merchants,
          COUNT(CASE WHEN status = 'Success' THEN 1 END) as successful_transactions,
          COUNT(CASE WHEN status != 'Success' AND status IS NOT NULL THEN 1 END) as failed_transactions
        FROM vw_complete_reconciliation 
        WHERE 1=1
      `;
            const params = [];
            if (filters.merchant_id) {
                query += ` AND merchant_id = ?`;
                params.push(filters.merchant_id);
            }
            if (filters.start_date && filters.end_date) {
                query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
                params.push(filters.start_date, filters.end_date);
            }
            if (filters.payment_brand) {
                query += ` AND payment_brand = ?`;
                params.push(filters.payment_brand);
            }
            query += ` GROUP BY DATE(transaction_time), source_type ORDER BY transaction_date DESC, source_type`;
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: 'Daily summary report generated successfully',
                data: result,
                count: result.length
            };
        }
        catch (error) {
            console.error('Error generating daily summary:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to generate daily summary report',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMerchantSummary(merchant_id, filters = {}) {
        try {
            let query = `
        SELECT 
          merchant_id,
          merchant_name,
          source_type,
          COUNT(*) as total_transactions,
          SUM(CASE WHEN transaction_amount IS NOT NULL THEN transaction_amount ELSE 0 END) as total_volume,
          SUM(CASE WHEN net_settlement_amount IS NOT NULL THEN net_settlement_amount ELSE 0 END) as total_settlement,
          AVG(CASE WHEN transaction_amount IS NOT NULL THEN transaction_amount ELSE NULL END) as avg_transaction_size,
          COUNT(CASE WHEN status = 'Success' THEN 1 END) as successful_transactions,
          COUNT(CASE WHEN status != 'Success' AND status IS NOT NULL THEN 1 END) as failed_transactions,
          ROUND((COUNT(CASE WHEN status = 'Success' THEN 1 END) * 100.0 / COUNT(*)), 2) as success_rate
        FROM vw_complete_reconciliation 
        WHERE merchant_id = ?
      `;
            const params = [merchant_id];
            if (filters.start_date && filters.end_date) {
                query += ` AND DATE(transaction_time) BETWEEN ? AND ?`;
                params.push(filters.start_date, filters.end_date);
            }
            if (filters.payment_brand) {
                query += ` AND payment_brand = ?`;
                params.push(filters.payment_brand);
            }
            query += ` GROUP BY merchant_id, merchant_name, source_type ORDER BY total_volume DESC`;
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: `Merchant summary for ${merchant_id} generated successfully`,
                data: result,
                count: result.length
            };
        }
        catch (error) {
            console.error('Error generating merchant summary:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to generate merchant summary report',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTableStructure(tableName) {
        try {
            const structure = await this.dataSource.query(`DESCRIBE ${tableName}`);
            return {
                status: 'success',
                message: `Table structure for ${tableName}`,
                data: structure,
                column_count: structure.length,
                columns: structure.map(col => col.Field)
            };
        }
        catch (error) {
            console.error('Error getting table structure:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to get table structure',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateTransactionExists(system_txn_id) {
        try {
            const query = `
        SELECT 
          primary_id,
          source_type,
          merchant_id,
          merchant_name,
          transaction_amount,
          status
        FROM vw_complete_reconciliation 
        WHERE primary_id = ?
      `;
            const result = await this.dataSource.query(query, [system_txn_id]);
            return {
                status: 'success',
                message: result.length > 0 ? 'Transaction found' : 'Transaction not found',
                data: result,
                exists: result.length > 0,
                count: result.length
            };
        }
        catch (error) {
            console.error('Error validating transaction:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to validate transaction',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTableCounts() {
        try {
            const queries = [
                { table: 'tb_acquirer_settlement', name: 'Acquirer Settlement' },
                { table: 'tb_psp_reconciliation', name: 'PSP Reconciliation' },
                { table: 'tb_settlement_summary', name: 'Settlement Summary' },
                { table: 'tb_transaction_details', name: 'Transaction Details' }
            ];
            const results = [];
            for (const { table, name } of queries) {
                const result = await this.dataSource.query(`SELECT COUNT(*) as count FROM ${table}`);
                results.push({
                    table: table,
                    name: name,
                    count: result[0].count
                });
            }
            return {
                status: 'success',
                message: 'Table counts retrieved successfully',
                data: results,
                total_records: results.reduce((sum, item) => sum + parseInt(item.count), 0)
            };
        }
        catch (error) {
            console.error('Error getting table counts:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to get table counts',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PaymentSystemService = PaymentSystemService;
exports.PaymentSystemService = PaymentSystemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PaymentSystemService);
//# sourceMappingURL=payment-system.service.js.map