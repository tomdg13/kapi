import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { IoCompanyController } from '../controller/iocompany.controller';
import { IoCompanyService } from '../service/iocompany.service';  


@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IocompanyEntity])
  ],
  controllers: [IoCompanyController],
  providers: [IoCompanyService],
  exports: [IoCompanyService],
})
export class IocompanyModule {}