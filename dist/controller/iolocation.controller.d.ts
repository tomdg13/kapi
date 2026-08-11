import { IoLocationService } from 'src/service/iolocation.service';
import { CreateIoLocationDto, UpdateIoLocationDto, IoLocationDto } from 'src/dto/iolocation.dto';
export declare class IoLocationController {
    private readonly ioLocationService;
    constructor(ioLocationService: IoLocationService);
    findLocationById(id: number): Promise<any>;
    findLocationsByStatus(query: IoLocationDto): Promise<any>;
    createLocation(createLocationDto: CreateIoLocationDto): Promise<{
        status: string;
        message: string;
    }>;
    updateLocation(id: number, updateLocationDto: UpdateIoLocationDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteLocation(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
