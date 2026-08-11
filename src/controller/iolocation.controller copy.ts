import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { IoLocationService } from 'src/service/iolocation.service';
import {
  CreateIoLocationDto,
  UpdateIoLocationDto,
  IoLocationDto,
  FindLocationByIdDto,
} from 'src/dto/iolocation.dto';

@Controller('iolocation')
export class IoLocationController {
  constructor(private readonly ioLocationService: IoLocationService) {}

  @Get(':id')
  async findLocationById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindLocationByIdDto = { id };
      return await this.ioLocationService.findLocationById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch location',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findLocationsByStatus(@Query(ValidationPipe) query: IoLocationDto) {
    try {
      return await this.ioLocationService.findLocationsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch locations',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createLocation(@Body(ValidationPipe) createLocationDto: CreateIoLocationDto) {
    try {
      return await this.ioLocationService.addLocationWithImage(createLocationDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create location',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateLocationDto: UpdateIoLocationDto,
  ) {
    try {
      return await this.ioLocationService.updateLocationWithImage(id, updateLocationDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update location',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteLocation(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ioLocationService.deleteLocation(id);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete location',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}