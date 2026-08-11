export declare enum InventoryStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BLOCKED = "blocked",
    RESERVED = "reserved",
    EXPIRED = "expired"
}
export declare enum CurrencyPrimary {
    LAK = "LAK",
    THB = "THB",
    USD = "USD"
}
export declare class IoInventory {
    inventory_id: number;
    product_id: number;
    location_id: number;
    reserved_quantity: number;
    available_quantity: number;
    last_updated: Date;
    created_date: Date;
    stock_in_quantity: number;
    stock_out_quantity: number;
    expire_date: Date;
    block_location: string;
    cost_price_lak: number;
    cost_price_thb: number;
    unit_price_lak: number;
    unit_price_thb: number;
    currency_primary: CurrencyPrimary;
    batch_number: string;
    supplier_id: number;
    status: InventoryStatus;
    get expiryStatus(): 'expired' | 'expiring_soon' | 'good';
    canReserve(quantity: number): boolean;
    canIssue(quantity: number): boolean;
    getProfitMarginLAK(): number;
    getProfitMarginTHB(): number;
}
