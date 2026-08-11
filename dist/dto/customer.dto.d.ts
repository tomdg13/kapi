export declare class CustomerDto {
    id: number;
    role: string;
    phone: string;
}
export declare class CreateOtpDto {
    message: string;
    otp?: string;
    phone: string;
    app?: string;
    date?: Date;
}
export declare class CustomerpDto {
    phone?: string;
    id?: number;
}
export declare class CheckPromoteDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
}
export declare class RequestOtpDto {
    phone: string;
}
export declare class CreateDriverDto {
    name: string;
    username: string;
    email: string;
    password?: string;
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
    language?: string;
    bio?: string;
    online?: string;
}
export declare class PromoteDto {
    promote_note: string;
    promote_photo: string;
    promote_date?: string;
    promote_phone: string;
    location: string;
}
