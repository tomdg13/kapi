import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Delete,
  Param,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { userioService } from 'src/service/userio.service';
import { UserioDto, CreateUserioDto, UpdateUserioDto } from 'src/dto/userio.dto';

@Controller('userio')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserioController {
  constructor(private readonly userioService: userioService) {}

  @Post('userioId')
  async findById(@Body() userioDto: UserioDto) {
    try {
      if (!userioDto.id) {
        throw new HttpException(
          'Userio ID is required',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.userioService.findUserioById(userioDto);
    } catch (error) {
      console.error('❌ findById error:', error);
      throw new HttpException(
        {
          status: 'error',
          error: 'Error fetching userio by ID',
          message: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('userioRole')
  async findByRole(@Body() userioDto: UserioDto) {
    try {
      if (!userioDto.role) {
        throw new HttpException(
          'Role is required',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.userioService.findUseriosByRole(userioDto);
    } catch (error) {
      console.error('❌ findByRole error:', error);
      throw new HttpException(
        {
          status: 'error',
          error: 'Error fetching userios by role',
          message: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add')
  async addUserio(@Body() createUserioDto: CreateUserioDto) {
    try {
      console.log('🟢 Received POST /add request');
      console.log('📦 Request body keys:', Object.keys(createUserioDto));

      return await this.userioService.addUserioWithPhoto(createUserioDto);
    } catch (error) {
      console.error('❌ addUserio error:', error);
      
      // Handle specific error types
      if (error.status === HttpStatus.CONFLICT) {
        throw error; // Re-throw conflict errors as-is
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create userio',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update/:phone')
  async updateUserio(
    @Param('phone') phone: string,
    @Body() updateUserioDto: UpdateUserioDto
  ) {
    try {
      console.log('🟡 Received PUT /update/:phone request');
      console.log('🆔 phone param:', phone);
      console.log('📦 Request body keys:', Object.keys(updateUserioDto));

      // Validate phone parameter
      if (!phone || !/^\d{8,15}$/.test(phone)) {
        throw new HttpException(
          'Invalid phone number format. Must be 8-15 digits.',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.userioService.updateUserioWithPhoto(phone, updateUserioDto);
      console.log('✅ Update result:', result);
      return result;
    } catch (error) {
      console.error('❌ updateUserio error:', error);
      
      // Handle specific error types
      if (error.status === HttpStatus.NOT_FOUND || error.status === HttpStatus.CONFLICT) {
        throw error; // Re-throw specific errors as-is
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update userio',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:phone')
  async deleteUserio(@Param('phone') phone: string) {
    try {
      console.log('🔴 Received DELETE /delete/:phone request');
      console.log('🆔 phone param:', phone);

      // Validate phone parameter
      if (!phone || !/^\d{8,15}$/.test(phone)) {
        throw new HttpException(
          'Invalid phone number format. Must be 8-15 digits.',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.userioService.deleteUserio(phone);
      console.log('✅ Delete result:', result);
      return result;
    } catch (error) {
      console.error('❌ deleteUserio error:', error);
      
      // Handle specific error types
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error; // Re-throw not found errors as-is
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete userio',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'success',
      message: 'Userio service is running',
      timestamp: new Date().toISOString(),
    };
  }
}