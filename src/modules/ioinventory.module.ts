// src/modules/ioinventory.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoInventoryController } from '../controller/ioinventory.controller';
import { IoInventoryService } from '../service/ioinventory.service';

@Module({
  imports: [
    // If you're using TypeORM entities, include them here
    // TypeOrmModule.forFeature([InventoryEntity])
  ],
  controllers: [IoInventoryController],
  providers: [IoInventoryService],
  exports: [IoInventoryService], // Export service if other modules need it
})
export class IoInventoryModule {}