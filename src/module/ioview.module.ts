import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { IoViewController } from '../controller/ioview.controller';
import { IoViewService } from '../service/ioview.service';  


@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IoviewEntity])
  ],
  controllers: [IoViewController],
  providers: [IoViewService],
  exports: [IoViewService],
})
export class IoviewModule {}