import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoStoreController } from '../controller/iostore.controller';
import { IoStoreService } from '../service/iostore.service';

@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IoStoreEntity])
  ],
  controllers: [IoStoreController],
  providers: [IoStoreService],
  exports: [IoStoreService],
})
export class IoStoreModule {}