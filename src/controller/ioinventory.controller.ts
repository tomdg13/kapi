// src/controller/ioinventory.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IoInventoryService } from '../service/ioinventory.service';
import {
  CreateInventoryDto,
} from '../dto/ioinventory.dto';

@Controller('inventory')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class IoInventoryController {
  constructor(private readonly ioInventoryService: IoInventoryService) { }

  // Create new inventory record
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInventory(@Body() createInventoryDto: CreateInventoryDto) {
    return await this.ioInventoryService.createInventory(createInventoryDto);
  }

  // Get inventory by company ID - NEW ENDPOINT
  @Get('company/:companyId')
  async getInventoryByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return await this.ioInventoryService.getInventoryByCompany(companyId);
  }

  // Get inventory by company ID - NEW ENDPOINT
  @Get('company/:companyId/stocklow')
  async getInventoryBStocklow(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return await this.ioInventoryService.getInventoryBStocklow(companyId);
  }

  // Get inventory by expire date - NEW ENDPOINT
  @Get('company/:companyId/expire')
  async getInventoryByExpire(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return await this.ioInventoryService.getInventoryByExpire(companyId);
  }



}