export declare class CreateIovendorDto {
    company_id: number;
    vendor_name: string;
    vendor_code?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    vendor_type?: 'input' | 'output' | 'both';
    status?: 'active' | 'inactive';
    notes?: string;
    image?: string;
}
export declare class UpdateIovendorDto {
    company_id?: number;
    vendor_name?: string;
    vendor_code?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    vendor_type?: 'input' | 'output' | 'both';
    status?: 'active' | 'inactive';
    notes?: string;
}
export declare class IovendorDto {
    status?: 'active' | 'inactive' | 'admin';
    company_id?: number;
    vendor_type?: 'input' | 'output' | 'both';
}
export declare class FindvendorByIdDto {
    id: number;
}
export declare class SearchVendorDto {
    company_id: number;
    search_term: string;
}
export declare class VendorByTypeDto {
    company_id: number;
    vendor_type: 'input' | 'output' | 'both';
}
export declare class VendorResponseDto {
    vendor_id: number;
    company_id: number;
    vendor_name: string;
    vendor_code: string | null;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    vendor_type: 'input' | 'output' | 'both';
    status: 'active' | 'inactive';
    created_date: Date;
    updated_date: Date;
    notes: string | null;
    image: string | null;
    image_url?: string | null;
}
export declare class ApiResponseDto<T> {
    status: 'success' | 'error' | 'not_found';
    message: string;
    data: T;
    error?: string;
}
