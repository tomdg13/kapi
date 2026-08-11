// src/modules/payment-system/dto/payment-system.dto.ts

import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

// =====================================================
// CREATE DTOs FOR EACH TABLE
// =====================================================

export class CreateAcquirerSettlementDto {
  @IsOptional() @IsString() psp_id?: string;
  @IsOptional() @IsString() psp_name?: string;
  @IsOptional() @IsString() group_id?: string;
  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsString() merchant_id?: string;
  @IsOptional() @IsString() merchant_name?: string;
  @IsOptional() @IsString() store_id?: string;
  @IsOptional() @IsString() store_name?: string;
  @IsOptional() @IsString() store_mcc?: string;
  @IsOptional() @IsString() terminal_id?: string;
  @IsOptional() @IsString() merchant_nation?: string;
  @IsOptional() @IsString() merchant_city?: string;
  @IsOptional() @IsDateString() merchant_txn_time?: string;
  @IsOptional() @IsDateString() system_txn_time?: string;
  @IsOptional() @IsDateString() txn_pay_time?: string;
  @IsOptional() @IsString() api_type?: string;
  @IsOptional() @IsString() txn_type?: string;
  @IsOptional() @IsString() payment_brand?: string;
  @IsOptional() @IsString() payment_method_variant?: string;
  @IsOptional() @IsString() merchant_txn_id?: string;
  @IsOptional() @IsString() merchant_order_reference?: string;
  @IsString() system_txn_id: string; // Required - Primary Key
  @IsOptional() @IsString() psp_txn_id?: string;
  @IsOptional() @IsString() original_merchant_txn_id?: string;
  @IsOptional() @IsString() original_system_txn_id?: string;
  @IsOptional() @IsString() original_psp_txn_id?: string;
  @IsOptional() @IsString() card_number?: string;
  @IsOptional() @IsString() funding_type?: string;
  @IsOptional() @IsString() product_id?: string;
  @IsOptional() @IsString() product_type_id?: string;
  @IsOptional() @IsString() issuer_country?: string;
  @IsOptional() @IsNumber() merchant_local_amt?: number;
  @IsOptional() @IsNumber() local_tips_amt?: number;
  @IsOptional() @IsNumber() local_surcharge_fee_amt?: number;
  @IsOptional() @IsNumber() local_capture_amt?: number;
  @IsOptional() @IsString() merchant_local_curr?: string;
  @IsOptional() @IsNumber() rate_of_local_to_txn?: number;
  @IsOptional() @IsNumber() merchant_txn_amt?: number;
  @IsOptional() @IsNumber() tips_amount?: number;
  @IsOptional() @IsNumber() surcharge_fee_amt?: number;
  @IsOptional() @IsNumber() merchant_capture_amt?: number;
  @IsOptional() @IsString() merchant_txn_curr?: string;
  @IsOptional() @IsNumber() user_billing_amt?: number;
  @IsOptional() @IsString() user_billing_curr?: string;
  @IsOptional() @IsString() eci?: string;
  @IsOptional() @IsString() txn_initiation_mode?: string;
  @IsOptional() @IsString() linkpay_order_id?: string;
  @IsOptional() @IsString() txn_status?: string;
  @IsOptional() @IsString() system_result_code?: string;
  @IsOptional() @IsString() psp_result_code?: string;
  @IsOptional() @IsString() psp_authorization_code?: string;
  @IsOptional() @IsString() crossborder_flag?: string;
  @IsOptional() @IsNumber() merchant_sttl_amt?: number;
  @IsOptional() @IsNumber() merchant_discount_amt?: number;
  @IsOptional() @IsString() merchant_sttl_curr?: string;
  @IsOptional() @IsNumber() rate_from_merchant_txn_to_sttl?: number;
  @IsOptional() @IsString() mdr_rules?: string;
  @IsOptional() @IsNumber() mdr_amount?: number;
  @IsOptional() @IsNumber() psp_scheme_fee?: number;
  @IsOptional() @IsNumber() acquirer_service_fee?: number;
  @IsOptional() @IsNumber() txn_service_fee?: number;
  @IsOptional() @IsNumber() vat_amount?: number;
  @IsOptional() @IsNumber() wht_amount?: number;
  @IsOptional() @IsNumber() net_merchant_sttl_amt?: number;
  @IsOptional() @IsNumber() psp_interchange_fee?: number;
  @IsOptional() @IsString() metadata?: string;
  @IsOptional() @IsString() settlement_account_name?: string;
  @IsOptional() @IsString() settlement_account_number?: string;
}

export class CreatePspReconciliationDto {
  @IsOptional() @IsString() acquirer_id?: string;
  @IsOptional() @IsString() acquirer_name?: string;
  @IsOptional() @IsString() psp_id?: string;
  @IsOptional() @IsString() psp_name?: string;
  @IsOptional() @IsString() group_id?: string;
  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsString() merchant_id?: string;
  @IsOptional() @IsString() merchant_name?: string;
  @IsOptional() @IsString() store_id?: string;
  @IsOptional() @IsString() store_name?: string;
  @IsOptional() @IsString() store_mcc?: string;
  @IsOptional() @IsString() terminal_id?: string;
  @IsOptional() @IsString() merchant_nation?: string;
  @IsOptional() @IsString() merchant_city?: string;
  @IsOptional() @IsDateString() merchant_txn_time?: string;
  @IsOptional() @IsDateString() system_txn_time?: string;
  @IsOptional() @IsDateString() txn_pay_time?: string;
  @IsOptional() @IsString() api_type?: string;
  @IsOptional() @IsString() txn_type?: string;
  @IsOptional() @IsString() payment_brand?: string;
  @IsOptional() @IsString() payment_method_variant?: string;
  @IsOptional() @IsString() merchant_txn_id?: string;
  @IsOptional() @IsString() merchant_order_reference?: string;
  @IsString() system_txn_id: string; // Required - Primary Key
  @IsOptional() @IsString() psp_txn_id?: string;
  @IsOptional() @IsString() original_merchant_txn_id?: string;
  @IsOptional() @IsString() original_system_txn_id?: string;
  @IsOptional() @IsString() original_psp_txn_id?: string;
  @IsOptional() @IsString() psp_arn?: string;
  @IsOptional() @IsString() psp_settlement_date?: string;
  @IsOptional() @IsString() card_number?: string;
  @IsOptional() @IsString() funding_type?: string;
  @IsOptional() @IsString() product_id?: string;
  @IsOptional() @IsString() product_type_id?: string;
  @IsOptional() @IsString() issuer_country?: string;
  @IsOptional() @IsNumber() merchant_local_amt?: number;
  @IsOptional() @IsNumber() local_tips_amt?: number;
  @IsOptional() @IsNumber() local_surcharge_fee_amt?: number;
  @IsOptional() @IsNumber() local_capture_amt?: number;
  @IsOptional() @IsString() merchant_local_curr?: string;
  @IsOptional() @IsNumber() rate_of_local_to_txn?: number;
  @IsOptional() @IsNumber() merchant_txn_amt?: number;
  @IsOptional() @IsNumber() tips_amount?: number;
  @IsOptional() @IsNumber() surcharge_fee_amt?: number;
  @IsOptional() @IsNumber() merchant_capture_amt?: number;
  @IsOptional() @IsString() merchant_txn_curr?: string;
  @IsOptional() @IsNumber() psp_txn_amt?: number;
  @IsOptional() @IsString() psp_txn_curr?: string;
  @IsOptional() @IsNumber() direct_fx_rate?: number;
  @IsOptional() @IsNumber() user_billing_amt?: number;
  @IsOptional() @IsString() user_billing_curr?: string;
  @IsOptional() @IsString() eci?: string;
  @IsOptional() @IsString() txn_initiation_mode?: string;
  @IsOptional() @IsString() linkpay_order_id?: string;
  @IsOptional() @IsString() txn_status?: string;
  @IsOptional() @IsString() system_result_code?: string;
  @IsOptional() @IsString() psp_result_code?: string;
  @IsOptional() @IsString() psp_authorization_code?: string;
  @IsOptional() @IsString() crossborder_flag?: string;
  @IsOptional() @IsNumber() psp_sttl_amt?: number;
  @IsOptional() @IsNumber() psp_discount_amt?: number;
  @IsOptional() @IsNumber() acquirer_discount_amt?: number;
  @IsOptional() @IsString() psp_sttl_curr?: string;
  @IsOptional() @IsNumber() rate_for_psp_txn_to_sttl?: number;
  @IsOptional() @IsNumber() psp_vat_amount?: number;
  @IsOptional() @IsNumber() psp_wht_amount?: number;
  @IsOptional() @IsNumber() psp_net_sttl_amt?: number;
  @IsOptional() @IsNumber() psp_interchange_fee?: number;
}

export class CreateSettlementSummaryDto {
  @IsOptional() @IsDateString() transaction_time?: string;
  @IsOptional() @IsDateString() payment_time?: string;
  @IsOptional() @IsDateString() terminal_settlement_time?: string;
  @IsString() order_number: string; // Required - Part of Primary Key
  @IsOptional() @IsString() psp_order_number?: string;
  @IsOptional() @IsString() original_order_number?: string;
  @IsOptional() @IsString() original_psp_order_number?: string;
  @IsOptional() @IsNumber() transaction_amount?: number;
  @IsOptional() @IsNumber() tips_amount?: number;
  @IsOptional() @IsString() transaction_currency?: string;
  @IsOptional() @IsString() transaction_type?: string;
  @IsOptional() @IsNumber() merchant_settlement_amount?: number;
  @IsOptional() @IsString() merchant_settlement_currency?: string;
  @IsOptional() @IsNumber() mdr_amount?: number;
  @IsOptional() @IsNumber() net_merchant_settlement_amount?: number;
  @IsOptional() @IsNumber() brand_settlement_amount?: number;
  @IsOptional() @IsString() brand_settlement_currency?: string;
  @IsOptional() @IsNumber() interchange_fee_amount?: number;
  @IsOptional() @IsNumber() net_brand_settlement_amount?: number;
  @IsOptional() @IsString() reconciliation_flag?: string;
  @IsOptional() @IsString() psp_name?: string;
  @IsOptional() @IsString() payment_brand?: string;
  @IsOptional() @IsString() crossboarder_flag?: string;
  @IsOptional() @IsString() card_number?: string;
  @IsOptional() @IsString() authorization_code?: string;
  @IsOptional() @IsString() mcc?: string;
  @IsOptional() @IsString() group_id?: string;
  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsString() merchant_id?: string;
  @IsOptional() @IsString() merchant_name?: string;
  @IsOptional() @IsString() store_id?: string;
  @IsOptional() @IsString() store_name?: string;
  @IsString() terminal_id: string; // Required - Part of Primary Key
  @IsOptional() @IsString() batch_number?: string;
  @IsOptional() @IsString() terminal_trace_number?: string;
  @IsOptional() @IsString() remark?: string;
}

export class CreateTransactionDetailsDto {
  @IsOptional() @IsString() no_seq?: string;
  @IsOptional() @IsString() transaction_type?: string;
  @IsString() order_number_rrn: string; // Required - Primary Key
  @IsOptional() @IsString() original_order_number_rrn?: string;
  @IsOptional() @IsString() card_number_summary?: string;
  @IsOptional() @IsString() acquirer_id?: string;
  @IsOptional() @IsString() acquirer_name?: string;
  @IsOptional() @IsString() group_id?: string;
  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsString() merchant_id?: string;
  @IsOptional() @IsString() merchant_name?: string;
  @IsOptional() @IsString() store_id?: string;
  @IsOptional() @IsString() store_name?: string;
  @IsOptional() @IsString() payment_brand?: string;
  @IsOptional() @IsString() mdr_amount?: string;
  @IsOptional() @IsString() transaction_amount?: string;
  @IsOptional() @IsString() transaction_currency?: string;
  @IsOptional() @IsString() transaction_status?: string;
  @IsOptional() @IsString() mdr?: string;
  @IsOptional() @IsDateString() creation_time?: string;
}

// =====================================================
// FILTER DTOs
// =====================================================

export class FilterDto {
  @IsOptional() @IsString() merchant_id?: string;
  @IsOptional() @IsString() start_date?: string;
  @IsOptional() @IsString() end_date?: string;
  @IsOptional() @IsString() transaction_status?: string;
  @IsOptional() @IsString() payment_brand?: string;
  @IsOptional() @IsNumber() limit?: number;
  @IsOptional() @IsNumber() offset?: number;
}

export class ImportCsvDto {
  csvData: any[];
  source_filename?: string;
}

