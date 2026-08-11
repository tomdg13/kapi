import { IovendorService } from 'src/service/iovendor.service';
import { CreateIovendorDto, UpdateIovendorDto, IovendorDto } from 'src/dto/iovendor.dto';
export declare class IovendorController {
    private readonly iovendorService;
    constructor(iovendorService: IovendorService);
    searchVendors(companyId: number, searchTerm: string): Promise<any>;
    getVendorsByType(companyId: number, vendorType: 'input' | 'output' | 'both'): Promise<any>;
    findVendorById(id: number): Promise<any>;
    findVendorsByStatus(query: IovendorDto): Promise<any>;
    createVendor(createVendorDto: CreateIovendorDto): Promise<{
        status: string;
        message: string;
    }>;
    updateVendor(id: number, updateVendorDto: UpdateIovendorDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteVendor(id: number): Promise<{
        status: string;
        message: string;
    }>;
    getActiveVendors(companyId: number): Promise<any>;
    getInactiveVendors(companyId: number): Promise<any>;
    getAllCompanyVendors(companyId: number): Promise<any>;
}
