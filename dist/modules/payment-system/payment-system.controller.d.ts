/// <reference types="multer" />
import { PaymentSystemService } from './payment-system.service';
import { CreateAcquirerSettlementDto, CreatePspReconciliationDto, CreateSettlementSummaryDto, CreateTransactionDetailsDto, FilterDto, ImportCsvDto } from './dto/payment-system.dto';
export declare class PaymentSystemController {
    private readonly paymentSystemService;
    constructor(paymentSystemService: PaymentSystemService);
    createAcquirerSettlement(dto: CreateAcquirerSettlementDto): Promise<any>;
    getAcquirerSettlements(filters: FilterDto): Promise<any>;
    importAcquirerSettlementCSV(dto: ImportCsvDto): Promise<any>;
    createPspReconciliation(dto: CreatePspReconciliationDto): Promise<any>;
    getPspReconciliations(filters: FilterDto): Promise<any>;
    importPspReconciliationCSV(dto: ImportCsvDto): Promise<any>;
    createSettlementSummary(dto: CreateSettlementSummaryDto): Promise<any>;
    getSettlementSummaries(filters: FilterDto): Promise<any>;
    importSettlementSummaryCSV(dto: ImportCsvDto): Promise<any>;
    createTransactionDetails(dto: CreateTransactionDetailsDto): Promise<any>;
    getTransactionDetails(filters: FilterDto): Promise<any>;
    importTransactionDetailsCSV(dto: ImportCsvDto): Promise<any>;
    getReconciliationReport(filters: FilterDto): Promise<any>;
    getDailySummary(filters: FilterDto): Promise<any>;
    getMerchantSummary(merchant_id: string, filters: FilterDto): Promise<any>;
    validateTransactionExists(system_txn_id: string): Promise<any>;
    getTableCounts(): Promise<any>;
    getTableStructure(tableName: string): Promise<any>;
    uploadCSV(tableType: string, file: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
}
