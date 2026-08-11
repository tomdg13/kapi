import { DataSource } from 'typeorm';
export declare class TrasactionService {
    private dataSource;
    constructor(dataSource: DataSource);
    private generateUniqueRRN;
    private getCurrentBalance;
    private createStatementEntryWithQueryRunner;
    findTransactionsByPhone(phone?: string): Promise<any>;
    addTransaction(dto: any): Promise<any>;
    findRecentTransactions(limit?: number): Promise<any>;
    findTransactionsByDateRange(phone: string, dateFrom: string, dateTo: string): Promise<any>;
    getCustomerStatement(phone: string, limit?: number): Promise<any>;
    getStatementByDateRange(phone: string, dateFrom: string, dateTo: string): Promise<any>;
    getCurrentBalanceDetailed(phone: string): Promise<any>;
    migrateTransactionsToStatements(): Promise<any>;
    getTransactionSummary(phone?: string): Promise<any>;
    getSystemHealth(): Promise<any>;
}
