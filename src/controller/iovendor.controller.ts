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
import { IovendorService } from 'src/service/iovendor.service';
import {
  CreateIovendorDto,
  UpdateIovendorDto,
  IovendorDto,
  FindvendorByIdDto,
} from 'src/dto/iovendor.dto';

@Controller('iovendor')
export class IovendorController {
  constructor(private readonly iovendorService: IovendorService) {}

  @Get('search/:companyId')
  async searchVendors(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('term') searchTerm: string,
  ) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Search term is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.iovendorService.searchVendors(companyId, searchTerm.trim());
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to search vendors',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('type/:companyId/:vendorType')
  async getVendorsByType(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('vendorType') vendorType: 'input' | 'output' | 'both',
  ) {
    try {
      return await this.iovendorService.getVendorsByType(companyId, vendorType);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch vendors by type',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findVendorById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindvendorByIdDto = { id };
      return await this.iovendorService.findvendorById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch vendor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findVendorsByStatus(@Query(ValidationPipe) query: IovendorDto) {
    try {
      return await this.iovendorService.findvendorsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch vendors',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createVendor(@Body(ValidationPipe) createVendorDto: CreateIovendorDto) {
    try {
      return await this.iovendorService.addVendor(createVendorDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create vendor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateVendor(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateVendorDto: UpdateIovendorDto,
  ) {
    try {
      return await this.iovendorService.updateVendor(id, updateVendorDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update vendor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteVendor(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.iovendorService.deleteVendor(id);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete vendor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Additional endpoints for enhanced functionality
  @Get('company/:companyId/active')
  async getActiveVendors(@Param('companyId', ParseIntPipe) companyId: number) {
    try {
      const query: IovendorDto = { company_id: companyId, status: 'active' };
      return await this.iovendorService.findvendorsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch active vendors',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('company/:companyId/inactive')
  async getInactiveVendors(@Param('companyId', ParseIntPipe) companyId: number) {
    try {
      const query: IovendorDto = { company_id: companyId, status: 'inactive' };
      return await this.iovendorService.findvendorsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch inactive vendors',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('company/:companyId/all')
  async getAllCompanyVendors(@Param('companyId', ParseIntPipe) companyId: number) {
    try {
      const query: IovendorDto = { company_id: companyId };
      return await this.iovendorService.findvendorsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch company vendors',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}