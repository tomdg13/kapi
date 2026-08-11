import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IobranchController } from '../controller/iobranch.controller';
import { IobranchService } from '../service/iobranch.service';

@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IobranchEntity])
  ],
  controllers: [IobranchController],
  providers: [IobranchService],
  exports: [IobranchService],
})
export class IobranchModule {}