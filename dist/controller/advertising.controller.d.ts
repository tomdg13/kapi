import { AdvertisingService } from 'src/service/advertising.service';
import { UpdateAdvertisingStatusDto } from 'src/dto/update-advertising-status.dto';
import { CreateAdvertisingDto } from 'src/dto/create-advertising.dto';
interface AdvertisingResponse {
    status: string;
    message: string;
    data?: any;
    error?: string;
}
export declare class AdvertisingController {
    private readonly advertisingService;
    constructor(advertisingService: AdvertisingService);
    getAllAdvertisings(): Promise<AdvertisingResponse>;
    createAdvertising(createAdvertisingDto: CreateAdvertisingDto): Promise<AdvertisingResponse>;
    updateAdvertisingStatus(id: number, statusDto: UpdateAdvertisingStatusDto): Promise<AdvertisingResponse>;
    updateAdvertising(id: number, advertisingDto: CreateAdvertisingDto): Promise<AdvertisingResponse>;
    deleteAdvertising(id: number): Promise<AdvertisingResponse>;
    getAllAdvertisingsLegacy(): Promise<AdvertisingResponse>;
    createAdvertisingLegacy(createAdvertisingDto: CreateAdvertisingDto): Promise<AdvertisingResponse>;
    updateAdvertisingLegacy(id: number, advertisingDto: CreateAdvertisingDto): Promise<AdvertisingResponse>;
    deleteAdvertisingLegacy(id: number): Promise<AdvertisingResponse>;
}
export {};
