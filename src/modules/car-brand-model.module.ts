import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrandEntity } from '../entity/car-brand.entity';
import { CarModelEntity } from '../entity/car-model.entity';
import { CarBrandModelService } from '../service/car-brand-model.service';
import { CarBrandModelController } from '../controller/car-brand-model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrandEntity, CarModelEntity])],
  providers: [CarBrandModelService],
  controllers: [CarBrandModelController],
})
export class CarBrandModelModule {}
