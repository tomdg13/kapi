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
import { IoProductService } from 'src/service/ioproduct.service';
import {
  CreateIoProductDto,
  UpdateIoProductDto,
  IoProductDto,
  FindProductByIdDto,
} from 'src/dto/ioproduct.dto';

@Controller('ioproduct')
export class IoProductController {
  constructor(private readonly ioProductService: IoProductService) {}

  @Get('barcode/:barcode')
  async findProductByBarcode(@Param('barcode') barcode: string) {
    try {
      console.log(`🔍 DEBUG: Searching for product with barcode: ${barcode}`);
      
      const result = await this.ioProductService.findProductByBarcode(barcode);
      
      if (result.status === 'not_found') {
        throw new HttpException(
          {
            status: 'not_found',
            message: result.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      return result;
    } catch (error) {
      console.error('❌ DEBUG: Error in barcode search controller:', error);
      
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to search product by barcode',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findProductById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindProductByIdDto = { id };
      return await this.ioProductService.findProductById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findProductsByStatus(@Query(ValidationPipe) query: IoProductDto) {
    try {
      return await this.ioProductService.findProductsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch products',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createProduct(@Body(ValidationPipe) createProductDto: CreateIoProductDto) {
    try {
      return await this.ioProductService.addProductWithImage(createProductDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateIoProductDto,
  ) {
    try {
      return await this.ioProductService.updateProductWithImage(id, updateProductDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ioProductService.deleteProduct(id);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete product',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}