export declare class TransactionDto {
    transaction_id?: number;
    passenger_id?: number;
    driver_id?: number;
    car_id?: number;
    pickup_lat?: number;
    pickup_lon?: number;
    dropoff_lat?: number;
    dropoff_lon?: number;
    prickup?: string;
    dropoff?: string;
    start_time?: string;
    end_time?: string;
    suggeste_price?: number;
    payment_price?: number;
    transaction_status?: string;
    review?: string;
}
