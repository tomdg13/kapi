import { SettlementDetailsService } from '../service/settlement_details.service';
import { CreateSettlementDetailsDto, UpdateSettlementDetailsDto, FindByCompanyDto, GetSummaryDto, GetByStatusDto } from '../dto/settlement_details.dto';
export declare class SettlementDetailsController {
    private readonly settlementDetailsService;
    constructor(settlementDetailsService: SettlementDetailsService);
    create(createDto: CreateSettlementDetailsDto): Promise<any>;
    checkDuplicates(body: {
        company_id: number;
        system_transaction_ids: string[];
    }): Promise<{
        status: string;
        message: string;
        data: {
            duplicates: any[];
            total_checked: number;
            duplicate_count: number;
        };
    }>;
    findAll(company_id?: number, start_date?: string, end_date?: string, transaction_type?: string, reconciliation_flag?: string, transaction_status?: string, funding_type?: string, crossborder_flag?: string, merchant_nation?: string, issuer_country?: string, payment_brand?: string, source_filename?: string, api_code?: string, limit?: number, offset?: number): Promise<any>;
    findByCompany(dto: FindByCompanyDto): Promise<any>;
    getSummary(dto: GetSummaryDto): Promise<any>;
    getByStatus(dto: GetByStatusDto): Promise<any>;
    getBySourceFile(company_id: number, source_filename: string): Promise<any>;
    getByApiCode(company_id: number, api_code: string): Promise<any>;
    getApiCodeStats(company_id: number, start_date?: string, end_date?: string): Promise<any>;
    getStatistics(company_id: number): Promise<{
        status: string;
        message: string;
        data: {
            total_transactions: any;
            summary: any;
            unmatched_count: any;
            purchase_count: any;
            refund_count: any;
            reconciliation_rate: string;
        };
    }>;
    getUnreconciled(company_id: number): Promise<any>;
    getDailyReport(company_id: number, date: string): Promise<any>;
    getMonthlyReport(company_id: number, year: number, month: number): Promise<any>;
    findById(id: number): Promise<any>;
    update(id: number, updateDto: UpdateSettlementDetailsDto): Promise<any>;
    delete(id: number): Promise<any>;
    createBulk(body: {
        settlements: CreateSettlementDetailsDto[];
    }): Promise<{
        status: string;
        message: string;
        summary: {
            total: number;
            successful: number;
            failed: number;
            success_rate: string;
        };
        results: any[];
        errors: any[];
    }>;
    importCSV(body: {
        source_filename: string;
        csv_data: any[];
    }): Promise<any>;
}
