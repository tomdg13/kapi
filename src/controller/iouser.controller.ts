
import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Put, Param,
} from '@nestjs/common';
import { iouserService } from 'src/service/iouser.service';
import { IouserDto } from 'src/dto/iouser.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';


export class ProvinceIdDto {
  @IsNotEmpty()
  @IsNumber()
  pr_id: number;
}


@Controller('iouser')
export class IouserController {
  constructor(private readonly iouserService: iouserService) {}
  @Post('iouserId')
  async findById(@Body() iouserDto: IouserDto) {
    try {
      return await this.iouserService.findIouserById(iouserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching iouser by ID',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('iouserRole')
  async findByRole(@Body() iouserDto: IouserDto) {
    try {
      return await this.iouserService.findIousersByRole(iouserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching iousers by role',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }





@Post('add')
async addUser(@Body() body: any) {
  // ADD THIS DEBUGGING CODE
  console.log('=== REQUEST ANALYSIS ===');
  console.log('All request keys:', Object.keys(body));
  console.log('Photo field analysis:', {
    'body.photo': typeof body.photo,
    'body.profile_image': typeof body.profile_image,
    'photo_exists': 'photo' in body,
    'profile_image_exists': 'profile_image' in body,
    'photo_value': body.photo ? 'HAS_VALUE' : 'NULL/UNDEFINED',
    'profile_image_value': body.profile_image ? 'HAS_VALUE' : 'NULL/UNDEFINED',
    'photo_length': body.photo?.length || 0,
    'profile_image_length': body.profile_image?.length || 0,
  });
  
  // Show the actual field names and values (without image data)
  Object.keys(body).forEach(key => {
    if (key.includes('image') || key.includes('photo')) {
      console.log(`${key}: ${body[key] ? `LENGTH=${body[key].length}` : 'NULL'}`);
    } else {
      console.log(`${key}: ${body[key]}`);
    }
  });
  console.log('=== END REQUEST ANALYSIS ===');
  //  console.log(body);
  // Your existing method call
  return await this.iouserService.addIouserWithPhoto(body);
}


@Put('update/:phone')
async updateIouser(
  @Param('phone') phone: string,
  @Body() iouserDto: any
) {
  console.log('🟡 Received PUT /update/:phone request');
  console.log('🆔 phone param:', phone);
  console.log('📦 Request body:', JSON.stringify(iouserDto, null, 2));

  if (!phone || !/^\d+$/.test(phone)) {
    throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
  }

  const result = await this.iouserService.updateIouserWithPhoto(phone, iouserDto);

  console.log('✅ Update result:', result);
  return result;
}

}

