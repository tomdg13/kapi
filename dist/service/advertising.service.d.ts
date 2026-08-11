import { DataSource } from 'typeorm';
import { UpdateAdvertisingStatusDto } from 'src/dto/update-advertising-status.dto';
interface AdvertisingDto {
    advertising_note: string;
    advertising_photo?: string;
    advertising_index: number;
    advertising_status: string;
    advertising_link?: string;
}
interface AdvertisingResponse {
    status: string;
    message: string;
    data?: any;
    error?: string;
}
export declare class AdvertisingService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    updateAdvertisingStatus(id: number, statusDto: UpdateAdvertisingStatusDto): Promise<AdvertisingResponse>;
    getAllAdvertisings(): Promise<AdvertisingResponse>;
    addAdvertisingWithPhoto(advertisingDto: AdvertisingDto): Promise<AdvertisingResponse>;
    updateAdvertising(id: number, advertisingDto: AdvertisingDto): Promise<AdvertisingResponse>;
    deleteAdvertising(id: number): Promise<AdvertisingResponse>;
    private saveAdvertisingImage;
    private deleteAdvertisingImage;
    private parseBase64Image;
    private getFileExtension;
}
export {};
