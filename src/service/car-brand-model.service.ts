import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrandEntity } from '../entity/car-brand.entity';
import { CarModelEntity } from '../entity/car-model.entity';

@Injectable()
export class CarBrandModelService {
  constructor(
    @InjectRepository(CarBrandEntity)
    private brandRepo: Repository<CarBrandEntity>,
    @InjectRepository(CarModelEntity)
    private modelRepo: Repository<CarModelEntity>,
  ) {}

  findAllBrands() {
    return this.brandRepo.find({ where: { is_active: 1 } });
  }

  findModelsByBrand(brand_id: number) {
    return this.modelRepo.find({ where: { brand_id, is_active: 1 } });
  }
}
