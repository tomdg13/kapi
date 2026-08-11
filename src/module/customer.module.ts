import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { CustomerController } from 'src/controller/customer.controller';
import { customerService } from 'src/service/customer.service';
import { SmsService } from 'src/service/sms.service';


@Module({
  imports: [HttpModule],
  controllers: [CustomerController],
  providers: [customerService, SmsService],
})
export class CustomerModule { }

