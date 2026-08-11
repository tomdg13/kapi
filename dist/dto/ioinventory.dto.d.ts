export declare enum InventoryStatus {
    ACTIVE = "active",
    BLOCKED = "blocked",
    EXPIRED = "expired",
    DAMAGED = "damaged"
}
export declare class CreateInventoryDto {
    product_id: number;
    product_name?: string;
    location_id?: number;
    location?: string;
    amount?: number;
    expire_date?: string;
    currency_primary?: string;
    batch_number?: string;
    supplier_id?: number;
    status?: InventoryStatus;
    barcode?: string;
    store_id?: number;
    store_name?: string;
    user_id?: string;
    branch_id?: number;
    txntype?: string;
    company_id?: number;
    price?: number;
}
