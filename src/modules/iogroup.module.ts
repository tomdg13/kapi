import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { IoGroupController } from '../controller/iogroup.controller';
import { IoGroupService } from '../service/iogroup.service';  


@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IogroupEntity])
  ],
  controllers: [IoGroupController],
  providers: [IoGroupService],
  exports: [IoGroupService],
})
export class IogroupModule {}