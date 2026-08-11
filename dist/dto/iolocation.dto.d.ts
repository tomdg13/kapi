export declare class CreateIoLocationDto {
    company_id: number;
    location: string;
    image?: string;
}
export declare class UpdateIoLocationDto {
    company_id?: number;
    location?: string;
    image?: string;
}
export declare class IoLocationDto {
    status?: string;
    company_id?: number;
}
export declare class FindLocationByIdDto {
    id: number;
}
