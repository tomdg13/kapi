import { IovendorDto, FindvendorByIdDto } from 'src/dto/iovendor.dto';
import { DataSource } from 'typeorm';
export declare class IovendorService {
    private dataSource;
    constructor(dataSource: DataSource);
    findvendorById(dto: FindvendorByIdDto): Promise<any>;
    findvendorsByStatus(dto: IovendorDto): Promise<any>;
    addVendor(vendorDto: any): Promise<{
        status: string;
        message: string;
    }>;
    updateVendor(vendorId: number, vendorDto: any): Promise<{
        status: string;
        message: string;
    }>;
    deleteVendor(vendorId: number): Promise<{
        status: string;
        message: string;
    }>;
    getVendorsByType(company_id: number, vendor_type: 'input' | 'output' | 'both'): Promise<any>;
    searchVendors(company_id: number, searchTerm: string): Promise<any>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
}
