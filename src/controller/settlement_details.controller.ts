import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { SettlementDetailsService } from '../service/settlement_details.service';
import {
  CreateSettlementDetailsDto,
  UpdateSettlementDetailsDto,
  FindByIdDto,
  FindByCompanyDto,
  GetSummaryDto,
  GetByStatusDto,
} from '../dto/settlement_details.dto';

@Controller('settlement-details')
export class SettlementDetailsController {
  constructor(private readonly settlementDetailsService: SettlementDetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createDto: CreateSettlementDetailsDto) {
    try {
      return await this.settlementDetailsService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('check-duplicates')
  @HttpCode(HttpStatus.OK)
  async checkDuplicates(
    @Body() body: { company_id: number; system_transaction_ids: string[] },
  ) {
    try {
      const { company_id, system_transaction_ids } = body;

      if (!company_id || !system_transaction_ids || !Array.isArray(system_transaction_ids)) {
        throw new BadRequestException('Invalid request parameters. company_id and system_transaction_ids array are required.');
      }

      if (system_transaction_ids.length === 0) {
        return {
          status: 'success',
          message: 'Duplicate check completed',
          data: {
            duplicates: [],
            total_checked: 0,
            duplicate_count: 0,
          },
        };
      }

      const existingRecords = await this.settlementDetailsService.findBySystemTransactionIds(
        company_id,
        system_transaction_ids,
      );

      const duplicates = existingRecords.map(record => record.system_transaction_id);

      return {
        status: 'success',
        message: 'Duplicate check completed',
        data: {
          duplicates,
          total_checked: system_transaction_ids.length,
          duplicate_count: duplicates.length,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to check duplicates',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(
    @Query('company_id') company_id?: number,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('transaction_type') transaction_type?: string,
    @Query('reconciliation_flag') reconciliation_flag?: string,
    @Query('transaction_status') transaction_status?: string,
    @Query('funding_type') funding_type?: string,
    @Query('crossborder_flag') crossborder_flag?: string,
    @Query('merchant_nation') merchant_nation?: string,
    @Query('issuer_country') issuer_country?: string,
    @Query('payment_brand') payment_brand?: string,
    @Query('source_filename') source_filename?: string,
    @Query('api_code') api_code?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const filters: any = {};
    
    if (company_id !== undefined) filters.company_id = Number(company_id);
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;
    if (transaction_type) filters.transaction_type = transaction_type;
    if (reconciliation_flag) filters.reconciliation_flag = reconciliation_flag;
    if (transaction_status) filters.transaction_status = transaction_status;
    if (funding_type) filters.funding_type = funding_type;
    if (crossborder_flag) filters.crossborder_flag = crossborder_flag;
    if (merchant_nation) filters.merchant_nation = merchant_nation;
    if (issuer_country) filters.issuer_country = issuer_country;
    if (payment_brand) filters.payment_brand = payment_brand;
    if (source_filename) filters.source_filename = source_filename;
    if (api_code) filters.api_code = api_code;
    if (limit !== undefined) filters.limit = Number(limit);
    if (offset !== undefined) filters.offset = Number(offset);

    return await this.settlementDetailsService.findAll(filters);
  }

  @Get('company')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findByCompany(@Query() dto: FindByCompanyDto) {
    return await this.settlementDetailsService.findByCompany(dto);
  }

  @Get('summary')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSummary(@Query() dto: GetSummaryDto) {
    return await this.settlementDetailsService.getSummary(dto);
  }

  @Get('status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getByStatus(@Query() dto: GetByStatusDto) {
    return await this.settlementDetailsService.getByStatus(dto);
  }

  @Get('source-file')
  async getBySourceFile(
    @Query('company_id', ParseIntPipe) company_id: number,
    @Query('source_filename') source_filename: string,
  ) {
    return await this.settlementDetailsService.getBySourceFile(company_id, source_filename);
  }

  @Get('api-code')
  async getByApiCode(
    @Query('company_id', ParseIntPipe) company_id: number,
    @Query('api_code') api_code: string,
  ) {
    return await this.settlementDetailsService.getByApiCode(company_id, api_code);
  }

  @Get('api-code-stats')
  async getApiCodeStats(
    @Query('company_id', ParseIntPipe) company_id: number,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return await this.settlementDetailsService.getApiCodeStats(company_id, {
      start_date,
      end_date,
    });
  }

  @Get('statistics')
  async getStatistics(@Query('company_id', ParseIntPipe) company_id: number) {
    const filters = { company_id };
    
    const [
      allTransactions,
      summary,
      unmatched,
      purchases,
      refunds
    ] = await Promise.all([
      this.settlementDetailsService.findAll(filters),
      this.settlementDetailsService.getSummary({ company_id }),
      this.settlementDetailsService.getByStatus({ company_id, reconciliation_flag: 'Unmatched' }),
      this.settlementDetailsService.findAll({ ...filters, transaction_type: 'PURCHASE' }),
      this.settlementDetailsService.findAll({ ...filters, transaction_type: 'REFUND' }),
    ]);

    return {
      status: 'success',
      message: 'Settlement statistics fetched successfully',
      data: {
        total_transactions: allTransactions.count,
        summary: summary.data,
        unmatched_count: unmatched.count,
        purchase_count: purchases.count,
        refund_count: refunds.count,
        reconciliation_rate: allTransactions.count > 0 
          ? ((allTransactions.count - unmatched.count) / allTransactions.count * 100).toFixed(2) + '%'
          : '0%',
      },
    };
  }

  @Get('unreconciled')
  async getUnreconciled(@Query('company_id', ParseIntPipe) company_id: number) {
    return await this.settlementDetailsService.getByStatus({
      company_id,
      reconciliation_flag: 'Unmatched',
    });
  }

  @Get('reports/daily')
  async getDailyReport(
    @Query('company_id', ParseIntPipe) company_id: number,
    @Query('date') date: string,
  ) {
    return await this.settlementDetailsService.getSummary({
      company_id,
      start_date: date,
      end_date: date,
    });
  }

  @Get('reports/monthly')
  async getMonthlyReport(
    @Query('company_id', ParseIntPipe) company_id: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;

    return await this.settlementDetailsService.getSummary({
      company_id,
      start_date: startDate,
      end_date: endDate,
    });
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const dto: FindByIdDto = { id };
    return await this.settlementDetailsService.findById(dto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSettlementDetailsDto,
  ) {
    return await this.settlementDetailsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.settlementDetailsService.delete(id);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createBulk(@Body() body: { settlements: CreateSettlementDetailsDto[] }) {
    const createDtos = body.settlements;
    
    if (!Array.isArray(createDtos) || createDtos.length === 0) {
      throw new HttpException(
        {
          status: 'error',
          message: 'settlements array is required and must not be empty',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const results = [];
    const errors = [];
    
    for (let i = 0; i < createDtos.length; i++) {
      try {
        const result = await this.settlementDetailsService.create(createDtos[i]);
        results.push({
          index: i,
          status: 'success',
          data: result.data,
        });
      } catch (error) {
        errors.push({
          index: i,
          status: 'error',
          message: error.response?.message || error.message,
          data: createDtos[i],
        });
      }
    }

    const successCount = results.length;
    const errorCount = errors.length;

    return {
      status: successCount > 0 ? 'success' : 'error',
      message: `Bulk create completed. ${successCount} successful, ${errorCount} failed.`,
      summary: {
        total: createDtos.length,
        successful: successCount,
        failed: errorCount,
        success_rate: ((successCount / createDtos.length) * 100).toFixed(2) + '%',
      },
      results: results,
      errors: errors,
    };
  }

  @Post('import-csv')
  @HttpCode(HttpStatus.CREATED)
  async importCSV(@Body() body: { source_filename: string; csv_data: any[] }) {
    const { source_filename, csv_data } = body;
    
    if (!source_filename || !csv_data || !Array.isArray(csv_data)) {
      throw new HttpException(
        {
          status: 'error',
          message: 'source_filename and csv_data array are required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.settlementDetailsService.createFromCSV(csv_data, source_filename);
  }
}