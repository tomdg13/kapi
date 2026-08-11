export declare class UserioDto {
    id?: string;
    role?: string;
}
export declare class CreateUserioDto {
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    document_id?: string;
    photo?: string;
    photo_id?: string;
    village_id?: number;
    district_id?: number;
    province_id?: number;
    branch_id?: number;
    company_id?: number;
    status?: string;
    role?: string;
    account_bank_id?: number;
    account_no?: string;
    account_name?: string;
    language?: string;
    bio?: string;
    online?: string;
}
export declare class UpdateUserioDto {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
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
    role?: string;
    account_bank_id?: number;
    account_no?: string;
    account_name?: string;
    language?: string;
    bio?: string;
    online?: string;
}
export declare class UserDto extends UserioDto {
}
export declare class UserioResponseDto {
    user_id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    document_id?: string;
    photo?: string;
    photo_id?: string;
    village_id?: number;
    district_id?: number;
    province_id?: number;
    branch_id?: number;
    company_id?: number;
    status: string;
    role: string;
    account_bank_id?: number;
    account_no?: string;
    account_name?: string;
    language: string;
    bio?: string;
    online: string;
}
export declare class SearchUserioDto {
    searchTerm: string;
}
export declare class CompanyCodeFilterDto {
    companyCode: string;
}
declare const _default: {
    UserioDto: typeof UserioDto;
    CreateUserioDto: typeof CreateUserioDto;
    UpdateUserioDto: typeof UpdateUserioDto;
    UserDto: typeof UserDto;
    UserioResponseDto: typeof UserioResponseDto;
    SearchUserioDto: typeof SearchUserioDto;
    CompanyCodeFilterDto: typeof CompanyCodeFilterDto;
};
export default _default;
