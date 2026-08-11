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
import { IoCompanyService } from 'src/service/iocompany.service';
import {
  CreateIocompanyDto,
  UpdateIocompanyDto,
  IocompanyDto,
  FindCompanyByIdDto,
  CompanyStatsDto,
  UpdateCompanyLogoDto,
  AdvancedSearchCompanyDto,
} from 'src/dto/iocompany.dto';

@Controller('iocompany')
export class IoCompanyController {
  constructor(private readonly ioCompanyService: IoCompanyService) {}

  /**
   * GET /api/iocompany/:id
   * Find a specific company by ID
   */
  @Get(':id')
  async findCompanyById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindCompanyByIdDto = { id };
      return await this.ioCompanyService.findCompanyById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch company',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/iocompany
   * Find companies by status, company_id, or other filters
   * Query params: status, company_id, business_type, search, page, limit, sort_by, sort_order
   */
  @Get()
  async findCompanysByStatus(@Query(ValidationPipe) query: IocompanyDto) {
    try {
      return await this.ioCompanyService.findCompanysByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch companies',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/iocompany/search/advanced
   * Advanced search with additional filters like employee count range, establishment year, etc.
   */
  @Get('search/advanced')
  async advancedSearchCompanies(@Query(ValidationPipe) query: AdvancedSearchCompanyDto) {
    try {
      return await this.ioCompanyService.findCompanysByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to perform advanced search',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/iocompany/stats/summary
   * Get company statistics
   * Query params: company_id (optional), date_from, date_to, business_type, status
   */
  @Get('stats/summary')
  async getCompanyStats(@Query(ValidationPipe) query: CompanyStatsDto) {
    try {
      return await this.ioCompanyService.getCompanyStats(query.company_id);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch company statistics',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/iocompany
   * Create a new company with auto-generated company_code
   * Required: company_name
   * Optional: company_name_en, business_type, tax_id, address, phone, email, website, 
   *          ceo_name, employee_count, established_year, image, logo, user_id
   */
  @Post()
  async createCompany(@Body(ValidationPipe) createCompanyDto: CreateIocompanyDto) {
    try {
      return await this.ioCompanyService.addCompanyWithImage(createCompanyDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create company',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/iocompany/:id
   * Update an existing company
   * All fields are optional
   */
  @Put(':id')
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCompanyDto: UpdateIocompanyDto,
  ) {
    try {
      return await this.ioCompanyService.updateCompanyWithImage(id, updateCompanyDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update company',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/iocompany/:id/logo
   * Update only the company logo
   */
  @Put(':id/logo')
  async updateCompanyLogo(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) logoDto: UpdateCompanyLogoDto,
  ) {
    try {
      const updateDto: UpdateIocompanyDto = { logo: logoDto.logo };
      return await this.ioCompanyService.updateCompanyWithImage(id, updateDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update company logo',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/iocompany/:id
   * Delete a company and its associated images (profile image and logo)
   */
  @Delete(':id')
  async deleteCompany(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ioCompanyService.deleteCompany(id);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete company',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}