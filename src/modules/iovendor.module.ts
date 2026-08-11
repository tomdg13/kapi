import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IovendorController } from '../controller/iovendor.controller';
import { IovendorService } from '../service/iovendor.service';

@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IovendorEntity])
  ],
  controllers: [IovendorController],
  providers: [IovendorService],
  exports: [IovendorService],
})
export class IovendorModule {}