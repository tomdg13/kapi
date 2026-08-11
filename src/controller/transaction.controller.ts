// controller/transaction.controller.ts
import { Controller, Post, Body, Get, Put, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { TrasactionService } from 'src/service/transaction.service';

@Controller('transaction')
export class TrasactionController {
  constructor(private readonly trasactionService: TrasactionService) {}

  // Existing working endpoint
  @Get('phone/:phone?')
  async findTransactionsByPhone(@Param('phone') phone?: string) {
    console.log(phone);
    return await this.trasactionService.findTransactionsByPhone(phone);
  }

  // Add new transaction
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addTransaction(@Body() transactionData: any) {
    console.log('Controller - adding transaction:', transactionData);
    return await this.trasactionService.addTransaction(transactionData);
  }

  // Get all transactions
  @Get('all')
  async getAllTransactions() {
    console.log('Controller - fetching all transactions');
    return await this.trasactionService.findTransactionsByPhone();
  }

  // Get balance by phone
  @Get('balance/:phone')
  async getBalanceByPhone(@Param('phone') phone: string) {
    console.log('Controller - getting balance for phone:', phone);
    try {
      const result = await this.trasactionService.findTransactionsByPhone(phone);
      if (result.status === 'success' && result.data.length > 0) {
        // Get the latest balance from the most recent transaction
        const latestTransaction = result.data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        
        return {
          status: 'success',
          message: `Balance for phone ${phone}`,
          data: {
            phone: phone,
            current_balance: latestTransaction.last_point || 0,
            last_transaction_date: latestTransaction.created_at
          }
        };
      } else {
        return {
          status: 'success',
          message: `No transactions found for phone ${phone}`,
          data: {
            phone: phone,
            current_balance: 0,
            last_transaction_date: null
          }
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to get balance',
        error: error.message
      };
    }
  }

  // Get recent transactions
  @Get('recent/:limit?')
  async getRecentTransactions(@Param('limit', ParseIntPipe) limit: number = 10) {
    console.log('Controller - getting recent transactions, limit:', limit);
    return await this.trasactionService.findRecentTransactions(limit);
  }

  // Get transactions by date range
  @Get('daterange/:phone/:dateFrom/:dateTo')
  async getTransactionsByDateRange(
    @Param('phone') phone: string,
    @Param('dateFrom') dateFrom: string,
    @Param('dateTo') dateTo: string
  ) {
    console.log('Controller - getting transactions by date range:', { phone, dateFrom, dateTo });
    return await this.trasactionService.findTransactionsByDateRange(phone, dateFrom, dateTo);
  }





}