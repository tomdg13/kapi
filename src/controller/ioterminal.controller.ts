import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { IoTerminalService } from 'src/service/ioterminal.service';
import {
  CreateIoterminalDto,
  UpdateIoterminalDto,
  UpdateTerminalApprovalDto,
  IoterminalDto,
  FindTerminalByIdDto,
  FindTerminalsByCompanyAndStoreDto,
  FindTerminalsByIdsDto,
  FindTerminalsBySerialDto,
  FindTerminalsBySimDto,
  FindTerminalsByExpireDateDto,
} from 'src/dto/ioterminal.dto';

@Controller('ioterminal')
export class IoTerminalController {
  constructor(private readonly ioTerminalService: IoTerminalService) {}

  /**
   * GET /api/ioterminal/company/:company_id/merchant/:merchant_id
   * Find stores by company_id and merchant_id
   */
  @Get('company/:company_id/merchant/:merchant_id')
  async findStoresByCompanyAndMerchant(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Param('merchant_id', ParseIntPipe) merchantId: number,
  ) {
    try {
      return await this.ioTerminalService.findStoresByCompanyAndMerchant(company_id, merchantId);
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

  /**
   * POST /api/ioterminal/bulk
   * Find multiple terminals by IDs
   */
  @Post('bulk')
  async findTerminalsByIds(@Body(ValidationPipe) dto: FindTerminalsByIdsDto) {
    try {
      return await this.ioTerminalService.findTerminalsByIds(dto.terminalIds);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminals',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/pending-approval
   * Get terminals pending approval
   */
  @Get('pending-approval')
  async getTerminalsPendingApproval(
    @Query('company_id', ParseIntPipe) companyId?: number,
  ) {
    try {
      return await this.ioTerminalService.getTerminalsPendingApproval(companyId);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch pending terminals',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/serial/:serial_number
   * Find terminals by serial number
   */
  @Get('serial/:serial_number')
  async findTerminalsBySerial(
    @Param('serial_number') serialNumber: string,
    @Query('company_id', ParseIntPipe) companyId?: number,
  ) {
    try {
      const dto: FindTerminalsBySerialDto = { 
        serial_number: serialNumber,
        company_id: companyId 
      };
      return await this.ioTerminalService.findTerminalsBySerial(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminals by serial number',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/sim/:sim_number
   * Find terminals by SIM number
   */
  @Get('sim/:sim_number')
  async findTerminalsBySim(
    @Param('sim_number') simNumber: string,
    @Query('company_id', ParseIntPipe) companyId?: number,
  ) {
    try {
      const dto: FindTerminalsBySimDto = { 
        sim_number: simNumber,
        company_id: companyId 
      };
      return await this.ioTerminalService.findTerminalsBySim(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminals by SIM number',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/expiring
   * Find terminals by expiry date range or expiring soon
   */
  @Get('expiring')
  async findTerminalsByExpireDate(@Query(ValidationPipe) query: FindTerminalsByExpireDateDto) {
    try {
      return await this.ioTerminalService.findTerminalsByExpireDate(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminals by expiry date',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/stats
   * Get terminal statistics (now includes PDF stats)
   */
  @Get('stats')
  async getTerminalStats(@Query('company_id', ParseIntPipe) companyId?: number) {
    try {
      return await this.ioTerminalService.getTerminalStats(companyId);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminal statistics',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/check-code/:terminal_code
   * Check if terminal code exists
   */
  @Get('check-code/:terminal_code')
  async checkTerminalCode(
    @Param('terminal_code') terminalCode: string,
    @Query('company_id', ParseIntPipe) companyId?: number,
  ) {
    try {
      const exists = await this.ioTerminalService.checkTerminalCodeExists(terminalCode, companyId);
      return {
        status: 'success',
        message: exists ? 'Terminal code already exists' : 'Terminal code is available',
        data: { exists, terminal_code: terminalCode },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to check terminal code',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/company/:company_id/store/:store_id/terminals
   * Find terminals by company and store
   */
  @Get('company/:company_id/store/:store_id/terminals')
  async findTerminalsByCompanyAndStore(
    @Param('company_id', ParseIntPipe) companyId: number,
    @Param('store_id', ParseIntPipe) storeId: number,
  ) {
    try {
      return await this.ioTerminalService.findTerminalsByCompanyAndStore(companyId, storeId);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminals by company and store',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal
   * Find terminals by status, company_id, or other filters
   */
  @Get()
  async findTerminalsByStatus(@Query(ValidationPipe) query: IoterminalDto) {
    try {
      return await this.ioTerminalService.findTerminalsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminals',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/ioterminal/:id
   * Find a specific terminal by ID (now includes PDF data)
   */
  @Get(':id')
  async findTerminalById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindTerminalByIdDto = { id };
      return await this.ioTerminalService.findTerminalById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch terminal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/ioterminal
   * Create a new terminal with optional image and PDF
   * 
   * Request body should include:
   * - terminal_name (required)
   * - company_id (required)
   * - image (optional): base64 string with format "data:image/jpeg;base64,..."
   * - terminal_pdf (optional): base64 string with format "data:application/pdf;base64,..."
   * - pdf_filename (optional): original filename of the PDF
   * - other terminal fields (serial_number, sim_number, expire_date, etc.)
   */
  @Post()
  async createTerminal(@Body(ValidationPipe) createTerminalDto: CreateIoterminalDto) {
    try {
      return await this.ioTerminalService.addTerminalWithImage(createTerminalDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create terminal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/ioterminal/:id
   * Update an existing terminal (supports image and PDF updates)
   * 
   * Request body can include:
   * - image (optional): new base64 image string - will replace existing image
   * - terminal_pdf (optional): new base64 PDF string - will replace existing PDF
   * - pdf_filename (optional): new PDF filename
   * - any other terminal fields to update
   * 
   * Note: Updating a terminal resets approval_status to 'reapproved'
   */
  @Put(':id')
  async updateTerminal(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTerminalDto: UpdateIoterminalDto,
  ) {
    try {
      return await this.ioTerminalService.updateTerminalWithImage(id, updateTerminalDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update terminal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PATCH /api/ioterminal/:id/approve
   * Update terminal approval status
   */
  @Patch(':id/approve')
  async updateTerminalApproval(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) approvalDto: UpdateTerminalApprovalDto,
  ) {
    try {
      return await this.ioTerminalService.updateTerminalApproval(id, approvalDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update terminal approval',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/ioterminal/:id
   * Delete a terminal (also deletes associated image and PDF files)
   */
  @Delete(':id')
  async deleteTerminal(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ioTerminalService.deleteTerminal(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete terminal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}