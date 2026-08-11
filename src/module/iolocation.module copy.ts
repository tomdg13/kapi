import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoLocationController } from '../controller/iolocation.controller';
import { IoLocationService } from '../service/iolocation.service';

@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IoLocationEntity])
  ],
  controllers: [IoLocationController],
  providers: [IoLocationService],
  exports: [IoLocationService],
})
export class IoLocationModule {}