// src/module/driver.module.ts (or app.module.ts)

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from '../controller/driver.controller';
import { DriverService } from '../service/driver.service';
import { PickupService } from '../service/pickup.service';
import { KdBook } from '../entity/kd_book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KdBook])],
  controllers: [DriverController],
  providers: [DriverService, PickupService],
})
export class DriverModule {}


// import { Module } from '@nestjs/common';
// import { DriverController } from 'src/controller/driver.controller';
// import { DriverService } from 'src/service/driver.service';

// import { DataSource } from 'typeorm';

// @Module({
//   controllers: [DriverController],
//   providers: [DriverService],
// })
// export class DriverModule {}
