// src/modules/payment-system/payment-system.controller.ts

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  Param, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentSystemService } from './payment-system.service';
import { 
  CreateAcquirerSettlementDto,
  CreatePspReconciliationDto,
  CreateSettlementSummaryDto,
  CreateTransactionDetailsDto,
  FilterDto,
  ImportCsvDto
} from './dto/payment-system.dto';

@Controller('payment-system')
export class PaymentSystemController {
  constructor(private readonly paymentSystemService: PaymentSystemService) {}

  // =====================================================
  // ACQUIRER SETTLEMENT ENDPOINTS
  // =====================================================

  @Post('acquirer-settlement')
  async createAcquirerSettlement(@Body() dto: CreateAcquirerSettlementDto) {
    return this.paymentSystemService.createAcquirerSettlement(dto);
  }

  @Get('acquirer-settlement')
  async getAcquirerSettlements(@Query() filters: FilterDto) {
    return this.paymentSystemService.getAcquirerSettlements(filters);
  }

  @Post('acquirer-settlement/import-csv')
  async importAcquirerSettlementCSV(@Body() dto: ImportCsvDto) {
    return this.paymentSystemService.importAcquirerSettlementCSV(dto.csvData);
  }

  // =====================================================
  // PSP RECONCILIATION ENDPOINTS
  // =====================================================

  @Post('psp-reconciliation')
  async createPspReconciliation(@Body() dto: CreatePspReconciliationDto) {
    return this.paymentSystemService.createPspReconciliation(dto);
  }

  @Get('psp-reconciliation')
  async getPspReconciliations(@Query() filters: FilterDto) {
    return this.paymentSystemService.getPspReconciliations(filters);
  }

  @Post('psp-reconciliation/import-csv')
  async importPspReconciliationCSV(@Body() dto: ImportCsvDto) {
    return this.paymentSystemService.importPspReconciliationCSV(dto.csvData);
  }

  // =====================================================
  // SETTLEMENT SUMMARY ENDPOINTS
  // =====================================================

  @Post('settlement-summary')
  async createSettlementSummary(@Body() dto: CreateSettlementSummaryDto) {
    return this.paymentSystemService.createSettlementSummary(dto);
  }

  @Get('settlement-summary')
  async getSettlementSummaries(@Query() filters: FilterDto) {
    return this.paymentSystemService.getSettlementSummaries(filters);
  }

  @Post('settlement-summary/import-csv')
  async importSettlementSummaryCSV(@Body() dto: ImportCsvDto) {
    return this.paymentSystemService.importSettlementSummaryCSV(dto.csvData);
  }

  // =====================================================
  // TRANSACTION DETAILS ENDPOINTS
  // =====================================================

  @Post('transaction-details')
  async createTransactionDetails(@Body() dto: CreateTransactionDetailsDto) {
    return this.paymentSystemService.createTransactionDetails(dto);
  }

  @Get('transaction-details')
  async getTransactionDetails(@Query() filters: FilterDto) {
    return this.paymentSystemService.getTransactionDetails(filters);
  }

  @Post('transaction-details/import-csv')
  async importTransactionDetailsCSV(@Body() dto: ImportCsvDto) {
    return this.paymentSystemService.importTransactionDetailsCSV(dto.csvData);
  }

  // =====================================================
  // REPORTING & ANALYTICS ENDPOINTS
  // =====================================================

  @Get('reports/reconciliation')
  async getReconciliationReport(@Query() filters: FilterDto) {
    return this.paymentSystemService.getReconciliationReport(filters);
  }

  @Get('reports/daily-summary')
  async getDailySummary(@Query() filters: FilterDto) {
    return this.paymentSystemService.getDailySummary(filters);
  }

  @Get('reports/merchant-summary/:merchant_id')
  async getMerchantSummary(@Param('merchant_id') merchant_id: string, @Query() filters: FilterDto) {
    return this.paymentSystemService.getMerchantSummary(merchant_id, filters);
  }

  // =====================================================
  // UTILITY ENDPOINTS
  // =====================================================

  @Get('validate-transaction/:system_txn_id')
  async validateTransactionExists(@Param('system_txn_id') system_txn_id: string) {
    return this.paymentSystemService.validateTransactionExists(system_txn_id);
  }

  @Get('table-counts')
  async getTableCounts() {
    return this.paymentSystemService.getTableCounts();
  }

  // =====================================================
  // DIAGNOSTIC ENDPOINTS
  // =====================================================

  @Get('debug/table-structure/:tableName')
  async getTableStructure(@Param('tableName') tableName: string) {
    return this.paymentSystemService.getTableStructure(tableName);
  }

  // =====================================================
  // FILE UPLOAD ENDPOINTS (OPTIONAL)
  // =====================================================

  @Post('upload-csv/:table_type')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(
    @Param('table_type') tableType: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    // Parse CSV file and call appropriate import method
    // This would require additional CSV parsing logic
    return { 
      status: 'success', 
      message: `CSV upload endpoint for ${tableType} - implement CSV parsing logic` 
    };
  }
}