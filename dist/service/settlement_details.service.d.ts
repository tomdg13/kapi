import { CreateSettlementDetailsDto, UpdateSettlementDetailsDto, FindByIdDto, FindByCompanyDto, GetSummaryDto, GetByStatusDto } from '../dto/settlement_details.dto';
import { DataSource } from 'typeorm';
export declare class SettlementDetailsService {
    private dataSource;
    constructor(dataSource: DataSource);
    checkDuplicates(company_id: number, system_transaction_ids: string[]): Promise<any>;
    findByCompany(dto: FindByCompanyDto): Promise<any>;
    private formatDateTimeForMySQL;
    create(dto: CreateSettlementDetailsDto): Promise<any>;
    createFromCSV(csvData: any[], sourceFilename: string): Promise<any>;
    private parseNumber;
    update(id: number, dto: UpdateSettlementDetailsDto): Promise<any>;
    findById(dto: FindByIdDto): Promise<any>;
    delete(id: number): Promise<any>;
    getSummary(dto: GetSummaryDto): Promise<any>;
    getByStatus(dto: GetByStatusDto): Promise<any>;
    findAll(filters?: {
        company_id?: number;
        start_date?: string;
        end_date?: string;
        transaction_type?: string;
        reconciliation_flag?: string;
        transaction_status?: string;
        funding_type?: string;
        crossborder_flag?: string;
        merchant_nation?: string;
        issuer_country?: string;
        payment_brand?: string;
        source_filename?: string;
        api_code?: string;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    getBySourceFile(company_id: number, source_filename: string): Promise<any>;
    getByApiCode(company_id: number, api_code: string): Promise<any>;
    getApiCodeStats(company_id: number, filters?: {
        start_date?: string;
        end_date?: string;
    }): Promise<any>;
    findBySystemTransactionIds(company_id: number, system_transaction_ids: string[]): Promise<any[]>;
}
