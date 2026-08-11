export declare enum MerchantStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    SUSPENDED = "suspended"
}
export declare enum MerchantType {
    RETAIL = "retail",
    WHOLESALE = "wholesale",
    FRANCHISE = "franchise",
    CORPORATE = "corporate"
}
export declare class BaseIomerchantDto {
    group_id?: number;
    company_id?: number;
    merchant_name?: string;
    merchant_code?: string;
    merchant_manager?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    merchant_type?: MerchantType;
    status?: MerchantStatus;
    opening_hours?: string;
    square_footage?: number;
    notes?: string;
    image?: string;
    user_id?: number;
    upi_percentage?: number;
    visa_percentage?: number;
    master_percentage?: number;
    account?: string;
}
export declare class CreateIomerchantDto extends BaseIomerchantDto {
    group_id?: number;
    company_id: number;
    merchant_name: string;
}
declare const UpdateIomerchantDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<BaseIomerchantDto, never>>>;
export declare class UpdateIomerchantDto extends UpdateIomerchantDto_base {
}
export declare class IomerchantDto {
    status?: MerchantStatus | 'admin';
    group_id?: number;
    company_id?: number;
    merchant_type?: MerchantType;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
}
export declare class FindMerchantByIdDto {
    id: number;
}
export declare class IomerchantResponseDto {
    merchant_id: number;
    group_id: number;
    company_id: number;
    merchant_name: string;
    merchant_code: string;
    merchant_manager?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    merchant_type?: MerchantType;
    status?: MerchantStatus;
    opening_hours?: string;
    square_footage?: number;
    notes?: string;
    merchant_image?: string;
    image_url?: string;
    upi_percentage?: number;
    visa_percentage?: number;
    master_percentage?: number;
    account?: string;
    created_date: string;
    updated_date: string;
}
export declare class BulkCreateIomerchantDto {
    merchants: CreateIomerchantDto[];
}
export declare class MerchantStatsDto {
    group_id?: number;
    company_id?: number;
    date_from?: string;
    date_to?: string;
}
export declare class FindMerchantsByGroupDto {
    group_id: number;
    company_id?: number;
}
export declare class FindMerchantsByCompanyAndGroupDto {
    company_id: number;
    group_id: number;
}
export {};
