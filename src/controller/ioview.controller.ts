import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { IoLocationDto, IoProductDto, IoTerminalDto } from '../dto/ioview.dto';
import { IoViewService } from '../service/ioview.service';

@Controller('ioview')
@UsePipes(new ValidationPipe({ transform: true }))
export class IoViewController {
  constructor(private readonly ioViewService: IoViewService) {}

  /**
   * Get locations by company
   * GET /ioview/locations?company_id=123
   */
  @Get('locations')
  async getLocations(@Query() dto: IoLocationDto) {
    try {
      return await this.ioViewService.findLocations(dto);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch locations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get products by company
   * GET /ioview/products?company_id=456
   */
  @Get('products')
  async getProducts(@Query() dto: IoProductDto) {
    try {
      return await this.ioViewService.findProducts(dto);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get terminals by company
   * GET /ioview/terminals?company_id=789
   */
  @Get('terminals')
  async getTerminals(@Query() dto: IoTerminalDto) {
    try {
      return await this.ioViewService.findTerminals(dto);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch terminals',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}