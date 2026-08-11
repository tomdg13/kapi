export declare class CreateIoviewDto {
    company_id: number;
    name?: string;
    description?: string;
    image?: string;
}
export declare class UpdateIoviewDto {
    company_id?: number;
    name?: string;
    description?: string;
    image?: string;
}
export declare class IoviewDto {
    id: number;
    company_id: number;
    name?: string;
    description?: string;
    image?: string;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
}
export declare class FindViewByIdDto {
    id: number;
    company_id: number;
}
export declare class IoLocationDto {
    company_id: number;
}
export declare class IoProductDto {
    company_id: number;
}
export declare class IoTerminalDto {
    company_id: number;
}
