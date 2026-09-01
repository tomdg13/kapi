import { Controller, Get, Query } from '@nestjs/common';
import { CarBrandModelService } from '../service/car-brand-model.service';

@Controller('user')
export class CarBrandModelController {
  constructor(private readonly service: CarBrandModelService) {}

  @Get('carBrand')
  async findAllBrands() {
    const data = await this.service.findAllBrands();
    return { status: 'success', data };
  }

  @Get('carModel')
  async findModelsByBrand(@Query('brand_id') brand_id: string) {
    const data = await this.service.findModelsByBrand(Number(brand_id));
    return { status: 'success', data };
  }
}
