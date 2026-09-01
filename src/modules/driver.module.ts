// src/modules/driver.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from '../controller/driver.controller';
import { DriverService } from '../service/driver.service';
import { PickupService } from '../service/pickup.service';
import { KdBook } from '../entity/kd_book.entity';
import { UserAuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KdBook]),
    UserAuthModule,
  ],
  controllers: [DriverController],
  providers: [DriverService, PickupService],
})
export class DriverModule {}
