import { IoStoreDto, FindStoreByIdDto } from 'src/dto/iostore.dto';
import { DataSource } from 'typeorm';
export declare class IoStoreService {
    private dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    findStoreById(dto: FindStoreByIdDto): Promise<any>;
    findStoresByStatus(dto: IoStoreDto): Promise<any>;
    private generateStoreCode;
    addStoreWithImage(storeDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    private validateStoreUniqueness;
    private validateForeignKeys;
    updateStoreWithImage(storeId: number, storeDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    private buildUpdateQuery;
    deleteStore(storeId: number): Promise<{
        status: string;
        message: string;
    }>;
    private saveImage;
    private deleteImageFile;
    private parseBase64Image;
    private getFileExtension;
    getGroupsByCompany(companyId: number): Promise<any>;
    getMerchantsByCompanyAndGroup(companyId: number, groupId?: number): Promise<any>;
    updateStoreApproval(storeId: number, approvalData: {
        approval_status: string;
        approved_by: string;
        approved_at: string;
        rejection_reason?: string;
        approve1?: string;
        approve2?: string;
    }): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
}
