export declare class CreateIoStoreDto {
    company_id: number;
    group_id?: number;
    merchant_id?: number;
    user_id?: number;
    store_name: string;
    store_code?: string;
    store_manager?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    store_type?: string;
    status?: string;
    opening_hours?: string;
    square_footage?: number;
    notes?: string;
    image?: string;
    upi_percentage?: number;
    visa_percentage?: number;
    master_percentage?: number;
    account?: string;
    account2?: string;
    email1?: string;
    email2?: string;
    email3?: string;
    email4?: string;
    email5?: string;
    store_mode?: string;
    web?: string;
    mcc?: string;
    account_name?: string;
    cif?: string;
    approve1?: string;
    approve2?: string;
}
export declare class UpdateIoStoreDto {
    company_id?: number;
    group_id?: number;
    merchant_id?: number;
    store_name?: string;
    store_code?: string;
    store_manager?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    store_type?: string;
    status?: string;
    opening_hours?: string;
    square_footage?: number;
    notes?: string;
    image?: string;
    upi_percentage?: number;
    visa_percentage?: number;
    master_percentage?: number;
    account?: string;
    account2?: string;
    email1?: string;
    email2?: string;
    email3?: string;
    email4?: string;
    email5?: string;
    store_mode?: string;
    web?: string;
    mcc?: string;
    account_name?: string;
    cif?: string;
    approve1?: string;
    approve2?: string;
    approval_status?: string;
    approved_by?: string;
    approved_at?: string;
    rejection_reason?: string;
}
export declare class UpdateStoreApprovalDto {
    approval_status: string;
    approved_by: string;
    approved_at: string;
    rejection_reason?: string;
    approve1?: string;
    approve2?: string;
}
export declare class IoStoreDto {
    status?: string;
    company_id?: number;
    group_id?: number;
    merchant_id?: number;
    store_mode?: string;
}
export declare class FindStoreByIdDto {
    id: number;
}
export declare class FindStoresByGroupDto {
    company_id: number;
    group_id: number;
}
export declare class FindStoresByMerchantDto {
    company_id: number;
    merchant_id: number;
}
