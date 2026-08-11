export declare function IsBase64Image(): PropertyDecorator;
export declare enum CompanyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    SUSPENDED = "suspended"
}
export declare class BaseIocompanyDto {
    company_name?: string;
    company_code?: string;
    company_name_en?: string;
    business_type?: string;
    tax_id?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    logo_url?: string;
    ceo_name?: string;
    employee_count?: number;
    established_year?: number;
    status?: CompanyStatus;
    image?: string;
    user_id?: number;
}
export declare class CreateIocompanyDto extends BaseIocompanyDto {
    company_name: string;
}
declare const UpdateIocompanyDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<BaseIocompanyDto, never>>>;
export declare class UpdateIocompanyDto extends UpdateIocompanyDto_base {
}
export declare class IocompanyDto {
    status?: CompanyStatus | 'admin';
    company_id?: number;
    business_type?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
}
export declare class FindCompanyByIdDto {
    id: number;
}
export declare class IocompanyResponseDto {
    company_id: number;
    company_name: string;
    company_code: string;
    company_name_en?: string;
    business_type?: string;
    tax_id?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo_url?: string;
    logo_full_url?: string;
    ceo_name?: string;
    employee_count?: number;
    established_year?: number;
    status?: CompanyStatus;
    created_at: string;
    updated_at: string;
}
export declare class BulkCreateIocompanyDto {
    companies: CreateIocompanyDto[];
}
export declare class CompanyStatsDto {
    company_id?: number;
    date_from?: string;
    date_to?: string;
    business_type?: string;
    status?: CompanyStatus;
}
export declare class UpdateCompanyLogoDto {
    logo: string;
}
export declare class AdvancedSearchCompanyDto extends IocompanyDto {
    min_employees?: number;
    max_employees?: number;
    established_from?: number;
    established_to?: number;
    country?: string;
    city?: string;
}
export {};
