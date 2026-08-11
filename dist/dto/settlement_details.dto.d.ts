export declare class CreateSettlementDetailsDto {
    company_id: number;
    transaction_time: string;
    pspid?: number;
    payment_time?: string;
    order_number?: string;
    psp_order_number?: number | null;
    original_order_number?: string;
    original_psp_order_number?: number | null;
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
    source_filename?: string;
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
export declare class UpdateSettlementDetailsDto {
    company_id?: number;
    transaction_time?: string;
    payment_time?: string;
    order_number?: string;
    psp_order_number?: number | null;
    original_order_number?: string;
    original_psp_order_number?: number | null;
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
    source_filename?: string;
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
export declare class SettlementDetailsDto {
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
export declare class FindByIdDto {
    id: number;
}
export declare class FindByCompanyDto {
    company_id: number;
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
    transaction_status?: string;
    funding_type?: string;
    crossborder_flag?: string;
    merchant_nation?: string;
    issuer_country?: string;
    payment_brand?: string;
    source_filename?: string;
    api_code?: string;
    extra_info?: string;
    reconciliation_flag?: string;
}
export declare class GetSummaryDto {
    company_id: number;
    start_date?: string;
    end_date?: string;
    merchant_nation?: string;
    payment_brand?: string;
    funding_type?: string;
    api_code?: string;
    extra_info?: string;
}
export declare class GetByStatusDto {
    company_id: number;
    reconciliation_flag: string;
}
export declare class GetByTransactionStatusDto {
    company_id: number;
    transaction_status: string;
    limit?: number;
    offset?: number;
}
export declare class GetBySourceFileDto {
    company_id: number;
    source_filename: string;
    limit?: number;
    offset?: number;
}
export declare class GetByApiCodeDto {
    company_id: number;
    api_code: string;
    extra_info?: string;
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
}
export declare class GetApiCodeStatsDto {
    company_id: number;
    start_date?: string;
    end_date?: string;
    api_code?: string;
    extra_info?: string;
}
export declare class GetGeographicSummaryDto {
    company_id: number;
    start_date?: string;
    end_date?: string;
    breakdown_by?: string;
}
export declare class ImportCSVDto {
    source_filename: string;
    csv_data: any[];
    company_id?: number;
    api_code?: string;
    extra_info?: string;
    batch_size?: number;
}
export declare class BulkCreateSettlementDetailsDto {
    settlements: CreateSettlementDetailsDto[];
    batch_size?: number;
}
export declare class DateRangeQueryDto {
    company_id: number;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
}
export declare class AnalyticsQueryDto {
    company_id: number;
    start_date?: string;
    end_date?: string;
    groupBy?: string;
    metrics?: string[];
    filters?: string[];
}
export declare class ResponseDto {
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
