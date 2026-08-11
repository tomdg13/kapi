// service/transaction.service.ts - COMPLETE ENHANCED VERSION WITH STATEMENT INTEGRATION
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TrasactionService {
  constructor(private dataSource: DataSource) { }

  // =================== EXISTING METHODS (ENHANCED) ===================

  // Generate unique 12-digit RRN
  private async generateUniqueRRN(): Promise<string> {
    let rrn: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      rrn = Math.floor(Math.random() * 900000000000 + 100000000000).toString();
      
      try {
        const existingRRN = await this.dataSource.query(
          'SELECT rrn FROM kd_txn WHERE rrn = ? LIMIT 1',
          [rrn]
        );
        
        if (existingRRN.length === 0) {
          isUnique = true;
        } else {
          attempts++;
        }
      } catch (error) {
        console.error('Error checking RRN uniqueness:', error);
        break;
      }
    }

    // Fallback if all attempts failed
    if (!isUnique) {
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      rrn = timestamp + random;
    }

    return rrn;
  }

  // =================== NEW HELPER METHODS ===================

  // Helper: Get current balance from transactions
  private async getCurrentBalance(phone: string): Promise<number> {
    const balanceQuery = `
      SELECT COALESCE(SUM(CASE 
        WHEN txn_type IN ('Get Point', 'EARN', 'BONUS') THEN CAST(point AS SIGNED)
        WHEN txn_type = 'TRANSFER' AND phone_to = ? THEN CAST(point AS SIGNED)
        WHEN txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND phone = ? THEN -CAST(point AS SIGNED)
        WHEN txn_type = 'ADJUST' THEN CAST(point AS SIGNED)
        ELSE 0 
      END), 0) as balance
      FROM kd_txn 
      WHERE phone = ? OR phone_to = ?
    `;

    const balanceResult = await this.dataSource.query(balanceQuery, [phone, phone, phone, phone]);
    return Number(balanceResult[0]?.balance || 0);
  }

  // Helper: Create statement entry with transaction support
  private async createStatementEntryWithQueryRunner(
    queryRunner: any,
    phone: string, 
    pointDebit: number, 
    pointCredit: number, 
    newBalance: number
  ): Promise<void> {
    try {
      const statementSql = `
        INSERT INTO kd_sttm (
          sttm_date, phone_cust, point_debit, point_credit, point_total
        ) VALUES (
          NOW(), ?, ?, ?, ?
        )
      `;
      
      await queryRunner.query(statementSql, [
        phone, 
        pointDebit || 0, 
        pointCredit || 0, 
        newBalance
      ]);

      console.log(`📋 Statement entry created for ${phone}: Debit=${pointDebit}, Credit=${pointCredit}, Balance=${newBalance}`);
    } catch (error) {
      console.error('❌ Failed to create statement entry:', error.message);
      throw error; // Re-throw to trigger transaction rollback
    }
  }

  // =================== ENHANCED EXISTING METHODS ===================

  // Get transactions by phone (enhanced with ordering)
  async findTransactionsByPhone(phone?: string): Promise<any> {
    try {
      let query = 'SELECT * FROM kd_txn';
      const params = [];

      if (phone) {
        query += ' WHERE phone = ? OR phone_to = ?';
        params.push(phone, phone);
      }

      query += ' ORDER BY created_at DESC';
      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: phone ? `Transactions for phone ${phone}` : 'All transactions fetched',
        data: result,
      };

    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch transactions',
        error: error.message,
      };
    }
  }

  // Add new transaction (enhanced with statement integration)
  async addTransaction(dto: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { txn_type, phone, phone_to, point, description, mobile_info, ip_address } = dto;

      // Ensure point is a number
      const pointValue = Number(point);
      if (isNaN(pointValue)) {
        await queryRunner.rollbackTransaction();
        return {
          status: 'error',
          message: 'Invalid point value - must be a number',
        };
      }

      // Get current balance
      const currentBalance = await this.getCurrentBalance(phone);

      // Check sufficient balance for spending transactions
      if ((txn_type === 'Use Point' || txn_type === 'REDEEM' || txn_type === 'TRANSFER') && currentBalance < pointValue) {
        await queryRunner.rollbackTransaction();
        return {
          status: 'error',
          message: 'Insufficient balance',
        };
      }

      // Calculate new balance and determine debit/credit for statement
      let newBalance: number = currentBalance;
      let pointDebit = 0;
      let pointCredit = 0;

      switch (txn_type) {
        case 'Get Point':
        case 'EARN':
        case 'BONUS':
          newBalance = currentBalance + pointValue;
          pointCredit = pointValue;
          break;
        case 'Use Point':
        case 'REDEEM':
        case 'TRANSFER':
          newBalance = currentBalance - pointValue;
          pointDebit = pointValue;
          break;
        case 'ADJUST':
          if (pointValue > currentBalance) {
            pointCredit = pointValue - currentBalance;
          } else {
            pointDebit = currentBalance - pointValue;
          }
          newBalance = pointValue;
          break;
        default:
          newBalance = currentBalance + pointValue;
          pointCredit = pointValue;
      }

      // Generate unique RRN
      const rrn = await this.generateUniqueRRN();

      // Insert transaction
      const escape = (val: any) =>
        val === null || val === undefined
          ? 'NULL'
          : typeof val === 'string'
            ? `'${val.replace(/'/g, "''")}'`
            : val;

      const transactionSql = `
        INSERT INTO kd_txn (
          txn_type, rrn, phone, phone_to, point_date, point,
          last_point, ip_address, mobile_info, transaction_hash,
          txn_status, created_at, previous_balance, description
        ) VALUES (
          ${escape(txn_type)}, ${escape(rrn)}, ${escape(phone)}, ${escape(phone_to)},
          NOW(), ${pointValue}, ${newBalance}, ${escape(ip_address)},
          ${escape(mobile_info)}, ${escape('hash_placeholder')}, 'COMPLETED',
          NOW(), ${currentBalance}, ${escape(description)}
        )
      `;

      const result = await queryRunner.query(transactionSql);
      const newTransactionId = result.insertId ?? (Array.isArray(result) && result[0]?.insertId) ?? null;

      // Create statement entry for primary phone
      await this.createStatementEntryWithQueryRunner(
        queryRunner, phone, pointDebit, pointCredit, newBalance
      );

      // Handle transfer - create statement entry for receiver
      if (txn_type === 'TRANSFER' && phone_to) {
        const receiverCurrentBalance = await this.getCurrentBalance(phone_to);
        const receiverNewBalance = receiverCurrentBalance + pointValue;
        
        await this.createStatementEntryWithQueryRunner(
          queryRunner, phone_to, 0, pointValue, receiverNewBalance
        );
      }

      await queryRunner.commitTransaction();

      // Log successful transaction
      console.log(`✅ Transaction created: ID=${newTransactionId}, RRN=${rrn}, Balance: ${currentBalance} → ${newBalance}`);

      return {
        status: 'success',
        message: 'Transaction created successfully',
        data: { 
          txn_id: newTransactionId,
          rrn,
          previous_balance: currentBalance,
          new_balance: newBalance
        },
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Transaction failed:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create transaction',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // Get recent transactions (unchanged)
  async findRecentTransactions(limit: number = 10): Promise<any> {
    try {
      const query = `
        SELECT t.*, tt.txntype, tt.txntype_la 
        FROM kd_txn t
        LEFT JOIN kd_txntype tt ON t.txntype_id = tt.txntype_id
        ORDER BY t.created_at DESC 
        LIMIT ?
      `;
      
      const result = await this.dataSource.query(query, [limit]);

      return {
        status: 'success',
        message: `Recent ${limit} transactions fetched`,
        data: result,
      };

    } catch (error) {
      console.error('Error fetching recent transactions:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch recent transactions',
        error: error.message,
      };
    }
  }

  // Get transactions by date range (unchanged)
  async findTransactionsByDateRange(phone: string, dateFrom: string, dateTo: string): Promise<any> {
    try {
      const query = `
        SELECT t.*, tt.txntype, tt.txntype_la 
        FROM kd_txn t
        LEFT JOIN kd_txntype tt ON t.txntype_id = tt.txntype_id
        WHERE (t.phone = ? OR t.phone_to = ?)
        AND DATE(t.created_at) BETWEEN ? AND ?
        ORDER BY t.created_at DESC
      `;
      
      const params = [phone, phone, dateFrom, dateTo];
      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: `Transactions for phone ${phone} from ${dateFrom} to ${dateTo}`,
        data: result,
      };

    } catch (error) {
      console.error('Error fetching transactions by date range:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch transactions by date range',
        error: error.message,
      };
    }
  }

  // =================== NEW STATEMENT METHODS ===================

  // Get customer statement
  async getCustomerStatement(phone: string, limit: number = 50): Promise<any> {
    try {
      const query = `
        SELECT 
          sttm_id,
          sttm_date,
          phone_cust,
          point_debit,
          point_credit,
          point_total,
          CASE 
            WHEN point_debit > 0 THEN 'DEBIT'
            WHEN point_credit > 0 THEN 'CREDIT'
            ELSE 'NEUTRAL'
          END as entry_type
        FROM kd_sttm 
        WHERE phone_cust = ?
        ORDER BY sttm_date DESC, sttm_id DESC
        LIMIT ?
      `;
      
      const result = await this.dataSource.query(query, [phone, limit]);

      return {
        status: 'success',
        message: `Statement for phone ${phone}`,
        data: result,
      };

    } catch (error) {
      console.error('Error fetching customer statement:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch customer statement',
        error: error.message,
      };
    }
  }

  // Get statement by date range
  async getStatementByDateRange(phone: string, dateFrom: string, dateTo: string): Promise<any> {
    try {
      const query = `
        SELECT 
          sttm_id,
          sttm_date,
          phone_cust,
          point_debit,
          point_credit,
          point_total,
          CASE 
            WHEN point_debit > 0 THEN 'DEBIT'
            WHEN point_credit > 0 THEN 'CREDIT'
            ELSE 'NEUTRAL'
          END as entry_type
        FROM kd_sttm 
        WHERE phone_cust = ?
        AND DATE(sttm_date) BETWEEN ? AND ?
        ORDER BY sttm_date DESC, sttm_id DESC
      `;
      
      const result = await this.dataSource.query(query, [phone, dateFrom, dateTo]);

      return {
        status: 'success',
        message: `Statement for phone ${phone} from ${dateFrom} to ${dateTo}`,
        data: result,
      };

    } catch (error) {
      console.error('Error fetching statement by date range:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch statement by date range',
        error: error.message,
      };
    }
  }

  // Get current balance (enhanced with detailed information)
  async getCurrentBalanceDetailed(phone: string): Promise<any> {
    try {
      // Get balance from transactions
      const transactionBalance = await this.getCurrentBalance(phone);
      
      // Get latest statement entry
      const latestStatementQuery = `
        SELECT point_total, sttm_date 
        FROM kd_sttm 
        WHERE phone_cust = ?
        ORDER BY sttm_date DESC, sttm_id DESC
        LIMIT 1
      `;
      
      const statementResult = await this.dataSource.query(latestStatementQuery, [phone]);
      const statementBalance = statementResult.length > 0 ? Number(statementResult[0].point_total) : null;
      const lastStatementDate = statementResult.length > 0 ? statementResult[0].sttm_date : null;

      return {
        status: 'success',
        message: `Balance details for phone ${phone}`,
        data: {
          phone: phone,
          transaction_balance: transactionBalance,
          statement_balance: statementBalance,
          balance_match: transactionBalance === statementBalance,
          last_statement_date: lastStatementDate
        },
      };

    } catch (error) {
      console.error('Error fetching balance details:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch balance details',
        error: error.message,
      };
    }
  }

  // =================== MIGRATION & ADMIN METHODS ===================

  // Migrate existing transactions to statements
  async migrateTransactionsToStatements(): Promise<any> {
    try {
      console.log('🔄 Starting migration of transactions to statements...');

      // Get all unique phone numbers
      const phonesQuery = `
        SELECT DISTINCT phone as phone_number FROM kd_txn WHERE phone IS NOT NULL
        UNION
        SELECT DISTINCT phone_to as phone_number FROM kd_txn WHERE phone_to IS NOT NULL
        ORDER BY phone_number
      `;
      
      const phones = await this.dataSource.query(phonesQuery);
      console.log(`📱 Found ${phones.length} unique phone numbers`);

      let migratedCount = 0;

      for (const phoneRow of phones) {
        const phone = phoneRow.phone_number;
        console.log(`\n👤 Processing phone: ${phone}`);

        // Get all transactions for this phone in chronological order
        const transactionsQuery = `
          SELECT txn_id, txn_type, phone, phone_to, point, created_at, point_date
          FROM kd_txn 
          WHERE phone = ? OR phone_to = ?
          ORDER BY COALESCE(point_date, created_at) ASC, txn_id ASC
        `;
        
        const transactions = await this.dataSource.query(transactionsQuery, [phone, phone]);
        console.log(`  📊 Found ${transactions.length} transactions`);

        let runningBalance = 0;

        for (const txn of transactions) {
          let pointDebit = 0;
          let pointCredit = 0;
          const pointValue = Number(txn.point);

          // Determine if this transaction affects this phone's balance
          const isEarning = (txn.txn_type === 'Get Point' || txn.txn_type === 'EARN' || txn.txn_type === 'BONUS') && txn.phone === phone;
          const isSpending = (txn.txn_type === 'Use Point' || txn.txn_type === 'REDEEM') && txn.phone === phone;
          const isTransferOut = txn.txn_type === 'TRANSFER' && txn.phone === phone;
          const isTransferIn = txn.txn_type === 'TRANSFER' && txn.phone_to === phone;
          const isAdjust = txn.txn_type === 'ADJUST' && txn.phone === phone;

          if (isEarning || isTransferIn) {
            runningBalance += pointValue;
            pointCredit = pointValue;
          } else if (isSpending || isTransferOut) {
            runningBalance -= pointValue;
            pointDebit = pointValue;
          } else if (isAdjust) {
            pointCredit = pointValue;
            runningBalance = pointValue;
          }

          // Create statement entry only if this transaction affects the balance
          if (pointCredit > 0 || pointDebit > 0) {
            const statementSql = `
              INSERT INTO kd_sttm (
                sttm_date, phone_cust, point_debit, point_credit, point_total
              ) VALUES (
                ?, ?, ?, ?, ?
              )
            `;
            
            const statementDate = txn.point_date || txn.created_at;
            await this.dataSource.query(statementSql, [
              statementDate, phone, pointDebit, pointCredit, runningBalance
            ]);

            migratedCount++;
          }
        }

        console.log(`  ✅ Final balance for ${phone}: ${runningBalance}`);
      }

      console.log(`\n🎉 Migration completed! Created ${migratedCount} statement entries`);

      return {
        status: 'success',
        message: 'Migration completed successfully',
        data: {
          phones_processed: phones.length,
          statements_created: migratedCount
        },
      };

    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      return {
        status: 'error',
        message: 'Migration failed',
        error: error.message,
      };
    }
  }

  // =================== ANALYTICS METHODS ===================

  // Get transaction summary analytics
  async getTransactionSummary(phone?: string): Promise<any> {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_transactions,
          SUM(CASE WHEN txn_type IN ('Get Point', 'EARN', 'BONUS') THEN point ELSE 0 END) as total_earned,
          SUM(CASE WHEN txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') THEN point ELSE 0 END) as total_spent,
          COUNT(CASE WHEN txn_type IN ('Get Point', 'EARN', 'BONUS') THEN 1 END) as earning_transactions,
          COUNT(CASE WHEN txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') THEN 1 END) as spending_transactions,
          MIN(created_at) as first_transaction,
          MAX(created_at) as last_transaction
        FROM kd_txn
      `;
      
      const params = [];
      if (phone) {
        query += ' WHERE phone = ? OR phone_to = ?';
        params.push(phone, phone);
      }

      const result = await this.dataSource.query(query, params);
      const summary = result[0];

      return {
        status: 'success',
        message: phone ? `Transaction summary for phone ${phone}` : 'Overall transaction summary',
        data: {
          phone: phone || 'ALL',
          total_transactions: Number(summary.total_transactions),
          total_earned: Number(summary.total_earned),
          total_spent: Number(summary.total_spent),
          net_points: Number(summary.total_earned) - Number(summary.total_spent),
          earning_transactions: Number(summary.earning_transactions),
          spending_transactions: Number(summary.spending_transactions),
          first_transaction: summary.first_transaction,
          last_transaction: summary.last_transaction,
        },
      };

    } catch (error) {
      console.error('Error fetching transaction summary:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch transaction summary',
        error: error.message,
      };
    }
  }

  // Get system health check
  async getSystemHealth(): Promise<any> {
    try {
      const [txnCount, sttmCount, typeCount] = await Promise.all([
        this.dataSource.query('SELECT COUNT(*) as count FROM kd_txn'),
        this.dataSource.query('SELECT COUNT(*) as count FROM kd_sttm'),
        this.dataSource.query('SELECT COUNT(*) as count FROM kd_txntype')
      ]);

      // Check for recent activity (last 24 hours)
      const recentActivity = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM kd_txn WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)'
      );

      return {
        status: 'healthy',
        message: 'System health check completed',
        data: {
          database: 'mysql',
          timestamp: new Date().toISOString(),
          tables: {
            kd_txn: Number(txnCount[0].count),
            kd_sttm: Number(sttmCount[0].count),
            kd_txntype: Number(typeCount[0].count)
          },
          recent_activity: {
            last_24h_transactions: Number(recentActivity[0].count)
          }
        },
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'System health check failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}