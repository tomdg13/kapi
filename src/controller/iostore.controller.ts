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
import { IoStoreService } from 'src/service/iostore.service';
import {
  CreateIoStoreDto,
  UpdateIoStoreDto,
  IoStoreDto,
  FindStoreByIdDto,
  FindStoresByGroupDto,
  FindStoresByMerchantDto,
  UpdateStoreApprovalDto,
} from 'src/dto/iostore.dto';

@Controller('iostore')
export class IoStoreController {
  constructor(private readonly ioStoreService: IoStoreService) {}

  @Get(':id')
  async findStoreById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindStoreByIdDto = { id };
      return await this.ioStoreService.findStoreById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch store',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findStoresByStatus(@Query(ValidationPipe) query: IoStoreDto) {
    try {
      return await this.ioStoreService.findStoresByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch stores',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('groups/:companyId')
  async getGroupsByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    try {
      return await this.ioStoreService.getGroupsByCompany(companyId);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch groups',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('merchants/:companyId')
  async getMerchantsByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('groupId', new ParseIntPipe({ optional: true })) groupId?: number,
  ) {
    try {
      return await this.ioStoreService.getMerchantsByCompanyAndGroup(companyId, groupId);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch merchants',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('group/:companyId/:groupId')
  async findStoresByGroup(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    try {
      const dto: FindStoresByGroupDto = { company_id: companyId, group_id: groupId };
      const query: IoStoreDto = { company_id: companyId, group_id: groupId };
      return await this.ioStoreService.findStoresByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch stores by group',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('merchant/:companyId/:merchantId')
  async findStoresByMerchant(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('merchantId', ParseIntPipe) merchantId: number,
  ) {
    try {
      const dto: FindStoresByMerchantDto = { company_id: companyId, merchant_id: merchantId };
      const query: IoStoreDto = { company_id: companyId, merchant_id: merchantId };
      return await this.ioStoreService.findStoresByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch stores by merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createStore(@Body(ValidationPipe) createStoreDto: CreateIoStoreDto) {
    try {
      return await this.ioStoreService.addStoreWithImage(createStoreDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create store',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateStoreDto: UpdateIoStoreDto,
  ) {
    try {
      return await this.ioStoreService.updateStoreWithImage(id, updateStoreDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update store',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // NEW: Store Approval Endpoint
  @Put(':id/approval')
  async updateStoreApproval(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) approvalData: UpdateStoreApprovalDto,
  ) {
    try {
      return await this.ioStoreService.updateStoreApproval(id, approvalData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update store approval',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteStore(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ioStoreService.deleteStore(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete store',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
}