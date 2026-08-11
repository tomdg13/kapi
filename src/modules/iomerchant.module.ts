import { Module } from '@nestjs/common';
import { IoMerchantController } from '../controller/iomerchant.controller';
import { IoMerchantService } from '../service/iomerchant.service';

@Module({
  imports: [],
  controllers: [IoMerchantController],
  providers: [IoMerchantService],
  exports: [IoMerchantService],
})
export class IomerchantModule {}