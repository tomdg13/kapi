// src/modules/payment-system/payment-system.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSystemController } from './payment-system.controller';
import { PaymentSystemService } from './payment-system.service';

@Module({
  imports: [
    // If you have entities, include them here:
    // TypeOrmModule.forFeature([AcquirerSettlement, PspReconciliation, SettlementSummary, TransactionDetails])
  ],
  controllers: [PaymentSystemController],
  providers: [PaymentSystemService],
  exports: [PaymentSystemService] // Export service if used in other modules
})
export class PaymentSystemModule {}