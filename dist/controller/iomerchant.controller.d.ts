import { IoMerchantService } from 'src/service/iomerchant.service';
import { CreateIomerchantDto, UpdateIomerchantDto, IomerchantDto } from 'src/dto/iomerchant.dto';
export declare class IoMerchantController {
    private readonly ioMerchantService;
    constructor(ioMerchantService: IoMerchantService);
    findMerchantsByCompanyAndGroup(company_id: number, group_id: number): Promise<any>;
    findMerchantsByStatus(query: IomerchantDto): Promise<any>;
    findMerchantById(id: number): Promise<any>;
    createMerchant(createMerchantDto: CreateIomerchantDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateMerchant(id: number, updateMerchantDto: UpdateIomerchantDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteMerchant(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
