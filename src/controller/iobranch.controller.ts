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
import { IobranchService } from 'src/service/iobranch.service';
import {
  CreateIobranchDto,
  UpdateIobranchDto,
  IobranchDto,
  FindbranchByIdDto,
} from 'src/dto/iobranch.dto';

@Controller('iobranch')
export class IobranchController {
  constructor(private readonly iobranchService: IobranchService) {}

  // General query route should come first
  @Get()
  async findBranchesByStatus(@Query(ValidationPipe) query: IobranchDto) {
    try {
      return await this.iobranchService.findbranchsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch branches',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Parameterized route should come after general routes
  @Get(':id')
  async findBranchById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindbranchByIdDto = { id };
      return await this.iobranchService.findbranchById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch branch',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createBranch(@Body(ValidationPipe) createBranchDto: CreateIobranchDto) {
    try {
      return await this.iobranchService.addbranchWithImage(createBranchDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create branch',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateBranch(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateBranchDto: UpdateIobranchDto,
  ) {
    try {
      return await this.iobranchService.updatebranchWithImage(id, updateBranchDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update branch',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteBranch(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.iobranchService.deletebranch(id);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete branch',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}