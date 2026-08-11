// src/controller/driver.controller.ts
import { Controller, Put, Post, Body } from '@nestjs/common';
import { DriverService } from '../service/driver.service';
import { PickupService } from '../service/pickup.service';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly pickupService: PickupService
  ) {}

  @Put('status')
  async updateDriverStatus(@Body() body: { phone: string; online: string }) {
    return this.driverService.updateDriverOnlineStatus(body.phone, body.online);
  }

  @Post('nearby')
  async getNearbyBookings(@Body() body: { lat: number; lon: number }) {
    return this.pickupService.findNearbyBookings(body.lat, body.lon);
  }

//  @Post('parameters')
//   async getPickupParameters() {
//     return this.pickupService.getAllParameters();
//   }
}