export declare class CreateIoProductDto {
    company_id: number;
    product_name: string;
    product_code?: string;
    description?: string;
    category?: string;
    brand?: string;
    barcode?: string;
    price?: number;
    supplier_id?: number;
    notes?: string;
    unit?: number;
    image?: string;
    status?: string;
}
export declare class UpdateIoProductDto {
    company_id?: number;
    product_name?: string;
    product_code?: string;
    description?: string;
    category?: string;
    brand?: string;
    barcode?: string;
    price?: number;
    supplier_id?: number;
    notes?: string;
    unit?: number;
    image?: string;
    status?: string;
}
export declare class IoProductDto {
    status?: string;
    company_id?: number;
}
export declare class FindProductByIdDto {
    id: number;
}
