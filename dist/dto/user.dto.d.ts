export declare class UserDto {
    id?: string;
    role?: string;
}
export declare class ProfileImageDto {
    customer_id: number;
    role?: string;
    profile_image: string;
}
export declare class CustomerIdDto {
    phone: number;
}
export declare class CreateUserDto {
    name: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    document_id?: string;
    photo?: string;
    photo_id?: string;
    village_id?: number;
    district_id?: number;
    province_id?: number;
    status?: string;
    role?: string;
    account_bank_id?: number;
    account_no?: string;
    account_name?: string;
}
export declare class CarDto {
    id?: string;
    role?: string;
}
