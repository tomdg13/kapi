// module/transaction.module.ts
import { Module } from '@nestjs/common';
import { TrasactionController } from 'src/controller/transaction.controller';
import { TrasactionService } from 'src/service/transaction.service';

@Module({
  controllers: [TrasactionController],
  providers: [TrasactionService],
  exports: [TrasactionService],
})
export class TrasactionModule {}
