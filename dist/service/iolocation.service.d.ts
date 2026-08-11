import { IoLocationDto, FindLocationByIdDto } from 'src/dto/iolocation.dto';
import { DataSource } from 'typeorm';
export declare class IoLocationService {
    private dataSource;
    constructor(dataSource: DataSource);
    findLocationById(dto: FindLocationByIdDto): Promise<any>;
    findLocationsByStatus(dto: IoLocationDto): Promise<any>;
    addLocationWithImage(locationDto: any): Promise<{
        status: string;
        message: string;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateLocationWithImage(locationId: number, locationDto: any): Promise<{
        status: string;
        message: string;
    }>;
    deleteLocation(locationId: number): Promise<{
        status: string;
        message: string;
    }>;
}
