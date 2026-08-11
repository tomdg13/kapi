import { DataSource } from 'typeorm';
import { CreateAcquirerSettlementDto, CreatePspReconciliationDto, CreateSettlementSummaryDto, CreateTransactionDetailsDto, FilterDto } from './dto/payment-system.dto';
export declare class PaymentSystemService {
    private dataSource;
    constructor(dataSource: DataSource);
    private formatDateTimeForMySQL;
    createAcquirerSettlement(dto: CreateAcquirerSettlementDto): Promise<any>;
    getAcquirerSettlements(filters?: FilterDto): Promise<any>;
    createPspReconciliation(dto: CreatePspReconciliationDto): Promise<any>;
    getPspReconciliations(filters?: FilterDto): Promise<any>;
    createSettlementSummary(dto: CreateSettlementSummaryDto): Promise<any>;
    getSettlementSummaries(filters?: FilterDto): Promise<any>;
    createTransactionDetails(dto: CreateTransactionDetailsDto): Promise<any>;
    getTransactionDetails(filters?: FilterDto): Promise<any>;
    importAcquirerSettlementCSV(csvData: any[]): Promise<any>;
    importPspReconciliationCSV(csvData: any[]): Promise<any>;
    importSettlementSummaryCSV(csvData: any[]): Promise<any>;
    importTransactionDetailsCSV(csvData: any[]): Promise<any>;
    getReconciliationReport(filters?: FilterDto): Promise<any>;
    getDailySummary(filters?: FilterDto): Promise<any>;
    getMerchantSummary(merchant_id: string, filters?: FilterDto): Promise<any>;
    getTableStructure(tableName: string): Promise<any>;
    validateTransactionExists(system_txn_id: string): Promise<any>;
    getTableCounts(): Promise<any>;
}
