import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe, 
  UsePipes, 
  ValidationPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AdvertisingService } from 'src/service/advertising.service';
import { UpdateAdvertisingStatusDto } from 'src/dto/update-advertising-status.dto';
import { CreateAdvertisingDto } from 'src/dto/create-advertising.dto';
import { Public } from 'src/auth/public.decorator';

interface AdvertisingResponse {
  status: string;
  message: string;
  data?: any;
  error?: string;
}

@Controller('advertising')
export class AdvertisingController {
  constructor(private readonly advertisingService: AdvertisingService) {}

  /**
   * Get all advertisings
   * GET /advertising
   */
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAdvertisings(): Promise<AdvertisingResponse> {
    return this.advertisingService.getAllAdvertisings();
  }

  /**
   * Create new advertising
   * POST /advertising
   */
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createAdvertising(
    @Body() createAdvertisingDto: CreateAdvertisingDto
  ): Promise<AdvertisingResponse> {
    console.log('🚀 Controller received body:', createAdvertisingDto);
    return this.advertisingService.addAdvertisingWithPhoto(createAdvertisingDto);
  }

  /**
   * Update advertising status
   * PUT /advertising/:id/status
   */
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateAdvertisingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateAdvertisingStatusDto,
  ): Promise<AdvertisingResponse> {
    return this.advertisingService.updateAdvertisingStatus(id, statusDto);
  }

  /**
   * Update entire advertising
   * PUT /advertising/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateAdvertising(
    @Param('id', ParseIntPipe) id: number,
    @Body() advertisingDto: CreateAdvertisingDto,
  ): Promise<AdvertisingResponse> {
    console.log('🔄 Updating advertising ID:', id, advertisingDto);
    return this.advertisingService.updateAdvertising(id, advertisingDto);
  }

  /**
   * Delete advertising
   * DELETE /advertising/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAdvertising(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdvertisingResponse> {
    console.log('🗑️ Deleting advertising ID:', id);
    return this.advertisingService.deleteAdvertising(id);
  }

  // Legacy endpoints for backward compatibility (if needed)
  
  /**
   * Legacy: Get all advertisings
   * POST /advertising/AdvertisingAll
   * @deprecated Use GET /advertising instead
   */
  @Post('AdvertisingAll')
  @HttpCode(HttpStatus.OK)
  async getAllAdvertisingsLegacy(): Promise<AdvertisingResponse> {
    console.log('⚠️ Using deprecated endpoint: POST /advertising/AdvertisingAll');
    return this.advertisingService.getAllAdvertisings();
  }

  /**
   * Legacy: Create advertising
   * POST /advertising/AddAdvertising
   * @deprecated Use POST /advertising instead
   */
  @Post('AddAdvertising')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createAdvertisingLegacy(
    @Body() createAdvertisingDto: CreateAdvertisingDto
  ): Promise<AdvertisingResponse> {
    console.log('⚠️ Using deprecated endpoint: POST /advertising/AddAdvertising');
    console.log('🚀 Controller received body:', createAdvertisingDto);
    return this.advertisingService.addAdvertisingWithPhoto(createAdvertisingDto);
  }

  /**
   * Legacy: Update advertising
   * PUT /advertising/UpdateAdvertising/:id
   * @deprecated Use PUT /advertising/:id instead
   */
  @Put('UpdateAdvertising/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateAdvertisingLegacy(
    @Param('id', ParseIntPipe) id: number,
    @Body() advertisingDto: CreateAdvertisingDto,
  ): Promise<AdvertisingResponse> {
    console.log('⚠️ Using deprecated endpoint: PUT /advertising/UpdateAdvertising/:id');
    return this.advertisingService.updateAdvertising(id, advertisingDto);
  }

  /**
   * Legacy: Delete advertising
   * DELETE /advertising/DeleteAdvertising/:id
   * @deprecated Use DELETE /advertising/:id instead
   */
  @Delete('DeleteAdvertising/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAdvertisingLegacy(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdvertisingResponse> {
    console.log('⚠️ Using deprecated endpoint: DELETE /advertising/DeleteAdvertising/:id');
    return this.advertisingService.deleteAdvertising(id);
  }
}