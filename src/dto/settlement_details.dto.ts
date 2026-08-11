import { IsOptional, IsNotEmpty, IsNumber, IsString, IsDateString, IsInt, IsIn, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateSettlementDetailsDto {
  @IsNotEmpty()
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsDateString()
  transaction_time: string;

  @IsOptional()
  @IsNumber()
  pspid?: number;

  @IsOptional()
  @IsDateString()
  payment_time?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  order_number?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  })
  psp_order_number?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  original_order_number?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  })
  original_psp_order_number?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  transaction_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  tips_amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  transaction_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_settlement_amount?: number;

  @IsOptional()
  @IsString()
  merchant_settlement_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  mdr_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  net_merchant_settlement_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  brand_settlement_amount?: number;

  @IsOptional()
  @IsString()
  brand_settlement_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  interchange_fee_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  net_brand_settlement_amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  reconciliation_flag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  transaction_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  psp_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  card_number?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ? String(value) : null)
  authorization_code?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ? String(value) : null)
  mcc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  crossborder_flag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  group_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  group_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  merchant_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  merchant_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  store_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  store_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  terminal_id?: string;

  @IsOptional()
  @IsDateString()
  terminal_settlement_time?: string;

  @IsOptional()
  @IsInt()
  batch_number?: number;

  @IsOptional()
  @IsInt()
  terminal_trace_number?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  source_filename?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  merchant_nation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  merchant_city?: string;

  @IsOptional()
  @IsDateString()
  system_transaction_time?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_method_variant?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  funding_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  product_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  product_type_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  issuer_country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  merchant_order_reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  system_transaction_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  original_system_transaction_id?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_local_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  local_tips_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  local_surcharge_fee_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  local_capture_amount?: number;

  @IsOptional()
  @IsString()
  merchant_local_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  rate_local_to_transaction?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  surcharge_fee_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_capture_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_discount_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  rate_transaction_to_settlement?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  mdr_rules?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  psp_scheme_fee?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  acquirer_service_fee?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  transaction_service_fee?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  vat_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  wht_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  user_billing_amount?: number;

  @IsOptional()
  @IsString()
  user_billing_currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  eci?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  transaction_initiation_mode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  linkpay_order_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  transaction_status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  system_result_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  psp_result_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  settlement_account_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  settlement_account_number?: string;

  @IsOptional()
  @IsString()
  metadata?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  extra_info?: string;
}

export class UpdateSettlementDetailsDto {
  @IsOptional()
  @IsNumber()
  company_id?: number;

  @IsOptional()
  @IsDateString()
  transaction_time?: string;

  @IsOptional()
  @IsDateString()
  payment_time?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  order_number?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  })
  psp_order_number?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  original_order_number?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  })
  original_psp_order_number?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  transaction_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  tips_amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  transaction_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_settlement_amount?: number;

  @IsOptional()
  @IsString()
  merchant_settlement_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  mdr_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  net_merchant_settlement_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  brand_settlement_amount?: number;

  @IsOptional()
  @IsString()
  brand_settlement_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  interchange_fee_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  net_brand_settlement_amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  reconciliation_flag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  transaction_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  psp_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  card_number?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ? String(value) : null)
  authorization_code?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ? String(value) : null)
  mcc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  crossborder_flag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  group_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  group_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  merchant_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  merchant_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  store_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  store_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  terminal_id?: string;

  @IsOptional()
  @IsDateString()
  terminal_settlement_time?: string;

  @IsOptional()
  @IsInt()
  batch_number?: number;

  @IsOptional()
  @IsInt()
  terminal_trace_number?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  source_filename?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  merchant_nation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  merchant_city?: string;

  @IsOptional()
  @IsDateString()
  system_transaction_time?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_method_variant?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  funding_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  product_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? String(value) : null)
  product_type_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  issuer_country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  merchant_order_reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  system_transaction_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  original_system_transaction_id?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_local_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  local_tips_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  local_surcharge_fee_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  local_capture_amount?: number;

  @IsOptional()
  @IsString()
  merchant_local_currency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  rate_local_to_transaction?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  surcharge_fee_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_capture_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  merchant_discount_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  rate_transaction_to_settlement?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  mdr_rules?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  psp_scheme_fee?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  acquirer_service_fee?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  transaction_service_fee?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  vat_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  wht_amount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  user_billing_amount?: number;

  @IsOptional()
  @IsString()
  user_billing_currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  eci?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  transaction_initiation_mode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value ? String(value) : null)
  linkpay_order_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  transaction_status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  system_result_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  psp_result_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  settlement_account_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  settlement_account_number?: string;

  @IsOptional()
  @IsString()
  metadata?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  extra_info?: string;
}

export class SettlementDetailsDto {
  id: number;
  company_id: number;
  transaction_time: string;
  payment_time?: string;
  order_number: string;
  psp_order_number?: number;
  original_order_number?: string;
  original_psp_order_number?: number;
  transaction_amount?: number;
  tips_amount?: number;
  transaction_currency?: string;
  merchant_settlement_amount?: number;
  merchant_settlement_currency?: string;
  mdr_amount?: number;
  net_merchant_settlement_amount?: number;
  brand_settlement_amount?: number;
  brand_settlement_currency?: string;
  interchange_fee_amount?: number;
  net_brand_settlement_amount?: number;
  reconciliation_flag?: string;
  transaction_type?: string;
  psp_name?: string;
  payment_brand?: string;
  card_number?: string;
  authorization_code?: string;
  mcc?: string;
  crossborder_flag?: string;
  group_id?: string;
  group_name?: string;
  merchant_id?: string;
  merchant_name?: string;
  store_id?: string;
  store_name?: string;
  terminal_id?: string;
  terminal_settlement_time?: string;
  batch_number?: number;
  terminal_trace_number?: number;
  remark?: string;
  created_at: Date;
  updated_at: Date;
  source_filename?: string;
  datetime_upload?: Date;
  datetime_created?: Date;
  datetime_modified?: Date;
  merchant_nation?: string;
  merchant_city?: string;
  system_transaction_time?: string;
  api_type?: string;
  payment_method_variant?: string;
  funding_type?: string;
  product_id?: string;
  product_type_id?: string;
  issuer_country?: string;
  merchant_order_reference?: string;
  system_transaction_id?: string;
  original_system_transaction_id?: string;
  merchant_local_amount?: number;
  local_tips_amount?: number;
  local_surcharge_fee_amount?: number;
  local_capture_amount?: number;
  merchant_local_currency?: string;
  rate_local_to_transaction?: number;
  surcharge_fee_amount?: number;
  merchant_capture_amount?: number;
  merchant_discount_amount?: number;
  rate_transaction_to_settlement?: number;
  mdr_rules?: string;
  psp_scheme_fee?: number;
  acquirer_service_fee?: number;
  transaction_service_fee?: number;
  vat_amount?: number;
  wht_amount?: number;
  user_billing_amount?: number;
  user_billing_currency?: string;
  eci?: string;
  transaction_initiation_mode?: string;
  linkpay_order_id?: string;
  transaction_status?: string;
  system_result_code?: string;
  psp_result_code?: string;
  settlement_account_name?: string;
  settlement_account_number?: string;
  metadata?: string;
  api_code?: string;
  extra_info?: string;
}

// Rest of the DTOs remain the same...
export class FindByIdDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class FindByCompanyDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  transaction_status?: string;

  @IsOptional()
  @IsString()
  funding_type?: string;

  @IsOptional()
  @IsString()
  crossborder_flag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  merchant_nation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  issuer_country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  source_filename?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  extra_info?: string;

  @IsOptional()
  @IsString()
  reconciliation_flag?: string;
}

export class GetSummaryDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  merchant_nation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_brand?: string;

  @IsOptional()
  @IsString()
  funding_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  extra_info?: string;
}

export class GetByStatusDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsString()
  reconciliation_flag: string;
}

export class GetByTransactionStatusDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsString()
  transaction_status: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}

export class GetBySourceFileDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  source_filename: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}

export class GetByApiCodeDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  api_code: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  extra_info?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;
}

export class GetApiCodeStatsDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  extra_info?: string;
}

export class GetGeographicSummaryDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  breakdown_by?: string;
}

export class ImportCSVDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  source_filename: string;

  @IsNotEmpty()
  @IsArray()
  csv_data: any[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  company_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  api_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  extra_info?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  batch_size?: number;
}

export class BulkCreateSettlementDetailsDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSettlementDetailsDto)
  settlements: CreateSettlementDetailsDto[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  batch_size?: number;
}

export class DateRangeQueryDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}

export class AnalyticsQueryDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  company_id: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  groupBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filters?: string[];
}

export class ResponseDto {
  status: string;
  message: string;
  data?: any;
  count?: number;
  summary?: {
    total_imported?: number;
    successful_imports?: number;
    failed_imports?: number;
    errors?: string[];
  };
}