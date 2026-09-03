import { Controller, Post, Body, HttpException, HttpStatus, Put } from '@nestjs/common';
import { CarService } from '../service/car.service';
import { CarDto } from '../dto/car.dto';
@Controller('car') // ✅ This sets /api/car as base route
export class CarController {
  constructor(private readonly carService: CarService) {}
  @Post('myCar')
  async getCarByDriverId(@Body() dto: CarDto) {
    return this.carService.findCarByDriverId(dto);
  }
   @Post('carRole') // ✅ Full path becomes /api/car/carRole
  async findCar(@Body() CarDto: CarDto) {
    try {
      return await this.carService.findCar(CarDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching cars by role',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
   @Post('carAdd')
  async addCar(@Body() body: any) {
    try {
      return await this.carService.addCar(body);
    } catch (error) {
      console.error('addCar error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create Car',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('kycUpdate')
async updateCarKyc(@Body() body: any) {
  try {
    return await this.carService.updateCarKyc(body);
  } catch (error) {
    console.error('updateCarKyc error:', error);
    throw new HttpException(
      { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to update KYC', error: error.message },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
  @Put('carUpdate')
async updateCar(@Body() body: any) {
  try {
    return await this.carService.updateCar(body);
  } catch (error) {
    console.error('updateCar error:', error);
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update car',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
  @Put('deleteCar')
async deleteCar(@Body() body: any) {
  try {
    return await this.carService.deleteCar(body);
  } catch (error) {
    console.error('deleteCar error:', error);
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to delete car',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
}
