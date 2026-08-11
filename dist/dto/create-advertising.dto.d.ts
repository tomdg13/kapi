export declare class CreateAdvertisingDto {
    advertising_note: string;
    advertising_photo?: string;
    advertising_index: number;
    advertising_status: string;
    advertising_link?: string;
}
export declare class UpdateAdvertisingDto {
    advertising_note?: string;
    advertising_photo?: string;
    advertising_index?: number;
    advertising_status?: string;
    advertising_link?: string;
}
export declare class AdvertisingFilterDto {
    status?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
