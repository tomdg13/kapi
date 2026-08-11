import { IoStoreService } from 'src/service/iostore.service';
import { CreateIoStoreDto, UpdateIoStoreDto, IoStoreDto, UpdateStoreApprovalDto } from 'src/dto/iostore.dto';
export declare class IoStoreController {
    private readonly ioStoreService;
    constructor(ioStoreService: IoStoreService);
    findStoreById(id: number): Promise<any>;
    findStoresByStatus(query: IoStoreDto): Promise<any>;
    getGroupsByCompany(companyId: number): Promise<any>;
    getMerchantsByCompany(companyId: number, groupId?: number): Promise<any>;
    findStoresByGroup(companyId: number, groupId: number): Promise<any>;
    findStoresByMerchant(companyId: number, merchantId: number): Promise<any>;
    createStore(createStoreDto: CreateIoStoreDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateStore(id: number, updateStoreDto: UpdateIoStoreDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateStoreApproval(id: number, approvalData: UpdateStoreApprovalDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteStore(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
