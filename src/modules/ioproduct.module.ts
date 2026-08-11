import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoProductController } from '../controller/ioproduct.controller';
import { IoProductService } from '../service/ioproduct.service';

@Module({
  imports: [
    // Add TypeORM module if you're using entities
    // TypeOrmModule.forFeature([IoProductEntity])
  ],
  controllers: [IoProductController],
  providers: [IoProductService],
  exports: [IoProductService],
})
export class IoProductModule {}