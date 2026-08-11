import { IoterminalDto, FindTerminalByIdDto, FindTerminalsByExpireDateDto, FindTerminalsBySerialDto, FindTerminalsBySimDto } from 'src/dto/ioterminal.dto';
import { DataSource } from 'typeorm';
export declare class IoTerminalService {
    private dataSource;
    constructor(dataSource: DataSource);
    private getBaseUrls;
    findTerminalById(dto: FindTerminalByIdDto): Promise<any>;
    findTerminalsByStatus(dto: IoterminalDto): Promise<any>;
    findTerminalsByCompanyAndStore(companyId: number, storeId: number): Promise<any>;
    private generateTerminalCode;
    addTerminalWithImage(terminalDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    private saveImage;
    private savePdf;
    private parseBase64File;
    private getFileExtension;
    updateTerminalWithImage(terminalId: number, terminalDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteTerminal(terminalId: number): Promise<{
        status: string;
        message: string;
    }>;
    getTerminalStats(companyId?: number): Promise<any>;
    checkTerminalCodeExists(terminalCode: string, companyId?: number): Promise<boolean>;
    findStoresByCompanyAndMerchant(companyId: number, merchantId: number): Promise<any>;
    findTerminalsByIds(terminalIds: number[]): Promise<any>;
    findTerminalsBySerial(dto: FindTerminalsBySerialDto): Promise<any>;
    findTerminalsBySim(dto: FindTerminalsBySimDto): Promise<any>;
    findTerminalsByExpireDate(dto: FindTerminalsByExpireDateDto): Promise<any>;
    updateTerminalApproval(terminalId: number, approvalDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    getTerminalsPendingApproval(companyId?: number): Promise<any>;
}
