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
import { IoMerchantService } from 'src/service/iomerchant.service';
import {
  CreateIomerchantDto,
  UpdateIomerchantDto,
  IomerchantDto,
  FindMerchantByIdDto,
  FindMerchantsByCompanyAndGroupDto,
} from 'src/dto/iomerchant.dto';

@Controller('iomerchant')
export class IoMerchantController {
  constructor(private readonly ioMerchantService: IoMerchantService) {}

  /**
   * GET /api/iomerchant/company/:company_id/group/:group_id
   * Find merchants by company_id and group_id
   * IMPORTANT: Specific routes must come FIRST
   */
  @Get('company/:company_id/group/:group_id')
  async findMerchantsByCompanyAndGroup(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Param('group_id', ParseIntPipe) group_id: number,
  ) {
    try {
      return await this.ioMerchantService.findMerchantsByCompanyAndGroup(company_id, group_id);
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

  /**
   * GET /api/iomerchant
   * Find merchants by status, company_id, or other filters
   * Query params: status, company_id, merchant_type, search, page, limit
   */
  @Get()
  async findMerchantsByStatus(@Query(ValidationPipe) query: IomerchantDto) {
    try {
      return await this.ioMerchantService.findMerchantsByStatus(query);
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

  /**
   * GET /api/iomerchant/:id
   * Find a specific merchant by ID
   */
  @Get(':id')
  async findMerchantById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindMerchantByIdDto = { id };
      return await this.ioMerchantService.findMerchantById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/iomerchant
   * Create a new merchant with auto-generated merchant_code
   * Required: company_id, merchant_name
   * Optional: phone, image (base64), user_id
   */
  @Post()
  async createMerchant(@Body(ValidationPipe) createMerchantDto: CreateIomerchantDto) {
    try {
      return await this.ioMerchantService.addMerchantWithImage(createMerchantDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/iomerchant/:id
   * Update an existing merchant
   * All fields are optional
   */
  @Put(':id')
  async updateMerchant(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMerchantDto: UpdateIomerchantDto,
  ) {
    try {
      return await this.ioMerchantService.updateMerchantWithImage(id, updateMerchantDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/iomerchant/:id
   * Delete a merchant and its associated image
   */
  @Delete(':id')
  async deleteMerchant(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ioMerchantService.deleteMerchant(id);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete merchant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}