import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { testService } from 'src/service/test.service';
import { TesttDto } from 'src/dto/test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly TestService: testService) { }

  @Post('search')
  async find(@Body() testDto: TesttDto) {
    try {
      return await this.TestService.find(testDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating adjustment',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
