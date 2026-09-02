import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CarBrandModelService } from '../service/car-brand-model.service';

@Controller('user')
export class CarBrandModelController {
  constructor(private readonly service: CarBrandModelService) {}

  // ===== Car Brand =====
  @Get('carBrand')
  async findAllBrands(@Query('car_type_id') car_type_id?: string) {
    const data = await this.service.findAllBrands(
      car_type_id ? Number(car_type_id) : undefined,
    );
    return { status: 'success', data };
  }

  @Post('carBrand')
  async addBrand(@Body() body: any) {
    const data = await this.service.addBrand(body);
    return { status: 'success', data };
  }

  @Put('carBrand/:id')
  async updateBrand(@Param('id') id: string, @Body() body: any) {
    const data = await this.service.updateBrand(Number(id), body);
    return { status: 'success', data };
  }

  @Delete('carBrand/:id')
  async deleteBrand(@Param('id') id: string) {
    await this.service.deleteBrand(Number(id));
    return { status: 'success', message: 'Brand deactivated' };
  }

  // ===== Car Model =====
  @Get('carModel')
  async findModelsByBrand(@Query('brand_id') brand_id: string) {
    const data = await this.service.findModelsByBrand(Number(brand_id));
    return { status: 'success', data };
  }

  @Post('carModel')
  async addModel(@Body() body: any) {
    const data = await this.service.addModel(body);
    return { status: 'success', data };
  }

  @Put('carModel/:id')
  async updateModel(@Param('id') id: string, @Body() body: any) {
    const data = await this.service.updateModel(Number(id), body);
    return { status: 'success', data };
  }

  @Delete('carModel/:id')
  async deleteModel(@Param('id') id: string) {
    await this.service.deleteModel(Number(id));
    return { status: 'success', message: 'Model deactivated' };
  }

  // ===== Car Type =====
  // Note: GET carType already exists in user.controller.ts (kd_cartype) -
  // only write operations live here to avoid a duplicate route.
  @Post('carType')
  async addCarType(@Body() body: any) {
    const data = await this.service.addCarType(body);
    return { status: 'success', data };
  }

  @Put('carType/:id')
  async updateCarType(@Param('id') id: string, @Body() body: any) {
    const data = await this.service.updateCarType(Number(id), body);
    return { status: 'success', data };
  }

  @Delete('carType/:id')
  async deleteCarType(@Param('id') id: string) {
    await this.service.deleteCarType(Number(id));
    return { status: 'success', message: 'Car type deleted' };
  }
}
