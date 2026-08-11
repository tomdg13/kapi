import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementDetailsController } from '../controller/settlement_details.controller';
import { SettlementDetailsService } from '../service/settlement_details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [SettlementDetailsController],
  providers: [SettlementDetailsService],
  exports: [SettlementDetailsService],
})
export class SettlementDetailsModule {}