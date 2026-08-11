import { IomerchantDto, FindMerchantByIdDto } from 'src/dto/iomerchant.dto';
import { DataSource } from 'typeorm';
export declare class IoMerchantService {
    private dataSource;
    constructor(dataSource: DataSource);
    findMerchantById(dto: FindMerchantByIdDto): Promise<any>;
    findMerchantsByStatus(dto: IomerchantDto): Promise<any>;
    private generateMerchantCode;
    addMerchantWithImage(merchantDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateMerchantWithImage(merchantId: number, merchantDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteMerchant(merchantId: number): Promise<{
        status: string;
        message: string;
    }>;
    getMerchantStats(companyId?: number): Promise<any>;
    checkMerchantCodeExists(merchantCode: string, companyId?: number): Promise<boolean>;
    findMerchantsByCompanyAndGroup(companyId: number, groupId: number): Promise<any>;
}
