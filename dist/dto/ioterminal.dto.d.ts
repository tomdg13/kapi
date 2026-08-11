export declare class BaseIoterminalDto {
    terminal_pdf?: string;
    pdf_filename?: string;
    store_id?: number;
    merchant_id?: number;
    group_id?: number;
    company_id?: number;
    terminal_name?: string;
    terminal_code?: string;
    phone?: string;
    serial_number?: string;
    sim_number?: string;
    expire_date?: string;
    create_by?: string;
    image?: string;
    user_id?: number;
}
export declare class CreateIoterminalDto extends BaseIoterminalDto {
    store_id?: number;
    company_id: number;
    terminal_name: string;
}
declare const UpdateIoterminalDto_base: import("@nestjs/mapped-types").MappedType<Partial<BaseIoterminalDto>>;
export declare class UpdateIoterminalDto extends UpdateIoterminalDto_base {
    approval_status?: string;
    approve1?: string;
    approve2?: string;
    approved_by?: string;
    approved_at?: string;
    rejection_reason?: string;
}
export declare class UpdateTerminalApprovalDto {
    approval_status: string;
    approved_by: string;
    approved_at: string;
    rejection_reason?: string;
    approve1?: string;
    approve2?: string;
}
export declare class IoterminalDto {
    status?: string | 'admin';
    store_id?: number;
    merchant_id?: number;
    group_id?: number;
    company_id?: number;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
    approval_status?: string;
}
export declare class FindTerminalByIdDto {
    id: number;
}
export declare class FindTerminalsByIdsDto {
    terminalIds: number[];
}
export declare class IoterminalResponseDto {
    terminal_id: number;
    store_id?: number;
    merchant_id?: number;
    group_id?: number;
    company_id?: number;
    terminal_name?: string;
    terminal_code?: string;
    phone?: string;
    serial_number?: string;
    sim_number?: string;
    expire_date?: string;
    create_by?: string;
    terminal_image?: string;
    image_url?: string;
    approval_status?: string;
    approve1?: string;
    approve2?: string;
    approved_by?: string;
    approved_at?: string;
    rejection_reason?: string;
    created_date: string;
    updated_date: string;
}
export declare class FindTerminalsByIdsResponseDto {
    status: string;
    message: string;
    data: any[];
}
export declare class BulkCreateIoterminalDto {
    terminals: CreateIoterminalDto[];
}
export declare class TerminalStatsDto {
    store_id?: number;
    merchant_id?: number;
    group_id?: number;
    company_id?: number;
    date_from?: string;
    date_to?: string;
}
export declare class FindTerminalsByStoreDto {
    store_id: number;
    company_id?: number;
}
export declare class FindTerminalsByCompanyAndStoreDto {
    company_id: number;
    store_id: number;
}
export declare class FindTerminalsByMerchantDto {
    merchant_id: number;
    company_id?: number;
}
export declare class FindTerminalsByGroupDto {
    group_id: number;
    company_id?: number;
}
export declare class CheckTerminalCodeDto {
    terminal_code: string;
    company_id?: number;
}
export declare class FindTerminalsBySerialDto {
    serial_number: string;
    company_id?: number;
}
export declare class FindTerminalsBySimDto {
    sim_number: string;
    company_id?: number;
}
export declare class FindTerminalsByExpireDateDto {
    date_from?: string;
    date_to?: string;
    company_id?: number;
    days_before_expiry?: number;
}
export {};
