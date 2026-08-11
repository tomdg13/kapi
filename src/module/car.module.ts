import { Module } from '@nestjs/common';
import { CarController } from 'src/controller/car.controller';
import { CarService } from 'src/service/car.service';


@Module({
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule { }

