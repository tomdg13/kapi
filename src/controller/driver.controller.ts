// src/controller/driver.controller.ts
import { Controller, Put, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DriverService } from '../service/driver.service';
import { PickupService } from '../service/pickup.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async getNearbyBookings(
    @Body() body: { lat: number; lon: number },
    @Req() req: any,
  ) {
    const driverUsername = req.user?.username;
    return this.pickupService.findNearbyBookings(body.lat, body.lon, driverUsername);
  }

//  @Post('parameters')
//   async getPickupParameters() {
//     return this.pickupService.getAllParameters();
//   }
}
