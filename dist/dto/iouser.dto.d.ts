export declare class CreateIouserDto {
    name: string;
    username?: string;
    email: string;
    password?: string;
    phone: string;
    document_id?: string;
    photo?: string;
    photo_id?: string;
    village_id?: number;
    district_id?: number;
    province_id?: number;
    branch_id: number;
    company_id: number;
    status?: string;
    role_id?: number;
    role_code?: string;
    role?: string;
    account_bank_id?: number;
    account_no?: string;
    account_name?: string;
    language?: string;
    bio?: string;
    online?: string;
}
export declare class UpdateIouserDto {
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    document_id?: string;
    photo?: string;
    photo_id?: string;
    village_id?: number;
    district_id?: number;
    province_id?: number;
    branch_id?: number;
    company_id?: number;
    status?: string;
    role_id?: number;
    role_code?: string;
    role?: string;
    account_bank_id?: number;
    account_no?: string;
    account_name?: string;
    language?: string;
    bio?: string;
    online?: string;
}
export declare class SearchIouserDto {
    company_id?: number;
    role_id?: number;
    role_code?: string;
    role?: string;
    status?: string;
    search_text?: string;
    page?: number;
    limit?: number;
}
export declare class IouserDto {
    id?: number;
    role_id?: number;
    role_code?: string;
    role?: string;
    company_id?: number;
}
