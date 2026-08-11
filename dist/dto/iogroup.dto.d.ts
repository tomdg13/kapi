export declare enum GroupStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    SUSPENDED = "suspended"
}
export declare enum GroupType {
    RETAIL = "retail",
    WHOLESALE = "wholesale",
    FRANCHISE = "franchise",
    CORPORATE = "corporate"
}
export declare class BaseIogroupDto {
    company_id?: number;
    group_name?: string;
    group_code?: string;
    group_manager?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    group_type?: GroupType;
    status?: GroupStatus;
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
export declare class CreateIogroupDto extends BaseIogroupDto {
    company_id: number;
    group_name: string;
}
declare const UpdateIogroupDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<BaseIogroupDto, never>>>;
export declare class UpdateIogroupDto extends UpdateIogroupDto_base {
}
export declare class IogroupDto {
    status?: GroupStatus | 'admin';
    company_id?: number;
    group_type?: GroupType;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
}
export declare class FindGroupByIdDto {
    id: number;
}
export declare class IogroupResponseDto {
    group_id: number;
    company_id: number;
    group_name: string;
    group_code: string;
    group_manager?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    group_type?: GroupType;
    status?: GroupStatus;
    opening_hours?: string;
    square_footage?: number;
    notes?: string;
    group_image?: string;
    image_url?: string;
    upi_percentage?: number;
    visa_percentage?: number;
    master_percentage?: number;
    account?: string;
    created_date: string;
    updated_date: string;
}
export declare class BulkCreateIogroupDto {
    groups: CreateIogroupDto[];
}
export declare class GroupStatsDto {
    company_id?: number;
    date_from?: string;
    date_to?: string;
}
export {};
