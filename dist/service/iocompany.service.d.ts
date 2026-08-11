import { IocompanyDto, FindCompanyByIdDto } from 'src/dto/iocompany.dto';
import { DataSource } from 'typeorm';
export declare class IoCompanyService {
    private dataSource;
    constructor(dataSource: DataSource);
    findCompanyById(dto: FindCompanyByIdDto): Promise<any>;
    findCompanysByStatus(dto: IocompanyDto): Promise<any>;
    private generateCompanyCode;
    addCompanyWithImage(companyDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateCompanyWithImage(companyId: number, companyDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteCompany(companyId: number): Promise<{
        status: string;
        message: string;
    }>;
    getCompanyStats(companyId?: number): Promise<any>;
}
