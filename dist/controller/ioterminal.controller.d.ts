import { IoTerminalService } from 'src/service/ioterminal.service';
import { CreateIoterminalDto, UpdateIoterminalDto, UpdateTerminalApprovalDto, IoterminalDto, FindTerminalsByIdsDto, FindTerminalsByExpireDateDto } from 'src/dto/ioterminal.dto';
export declare class IoTerminalController {
    private readonly ioTerminalService;
    constructor(ioTerminalService: IoTerminalService);
    findStoresByCompanyAndMerchant(company_id: number, merchantId: number): Promise<any>;
    findTerminalsByIds(dto: FindTerminalsByIdsDto): Promise<any>;
    getTerminalsPendingApproval(companyId?: number): Promise<any>;
    findTerminalsBySerial(serialNumber: string, companyId?: number): Promise<any>;
    findTerminalsBySim(simNumber: string, companyId?: number): Promise<any>;
    findTerminalsByExpireDate(query: FindTerminalsByExpireDateDto): Promise<any>;
    getTerminalStats(companyId?: number): Promise<any>;
    checkTerminalCode(terminalCode: string, companyId?: number): Promise<{
        status: string;
        message: string;
        data: {
            exists: boolean;
            terminal_code: string;
        };
    }>;
    findTerminalsByCompanyAndStore(companyId: number, storeId: number): Promise<any>;
    findTerminalsByStatus(query: IoterminalDto): Promise<any>;
    findTerminalById(id: number): Promise<any>;
    createTerminal(createTerminalDto: CreateIoterminalDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateTerminal(id: number, updateTerminalDto: UpdateIoterminalDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateTerminalApproval(id: number, approvalDto: UpdateTerminalApprovalDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteTerminal(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
