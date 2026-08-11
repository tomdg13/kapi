import { TrasactionService } from 'src/service/transaction.service';
export declare class TrasactionController {
    private readonly trasactionService;
    constructor(trasactionService: TrasactionService);
    findTransactionsByPhone(phone?: string): Promise<any>;
    addTransaction(transactionData: any): Promise<any>;
    getAllTransactions(): Promise<any>;
    getBalanceByPhone(phone: string): Promise<{
        status: string;
        message: string;
        data: {
            phone: string;
            current_balance: any;
            last_transaction_date: any;
        };
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getRecentTransactions(limit?: number): Promise<any>;
    getTransactionsByDateRange(phone: string, dateFrom: string, dateTo: string): Promise<any>;
}
