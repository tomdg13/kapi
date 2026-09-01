
import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Put, Param, Query,
} from '@nestjs/common';
import {  CarDto, CreateUserDto, CustomerIdDto, ProfileImageDto } from 'src/dto/user.dto';
import { userService } from 'src/service/user.service';
import { UserDto } from 'src/dto/user.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { Public } from 'src/auth/public.decorator';


// import { Controller, Post, Body } from '@nestjs/common';
// import { userService } from 'src/service/user.service';



export class ProvinceIdDto {
  @IsNotEmpty()
  @IsNumber()
  pr_id: number;
}


@Controller('user')
export class UserController {
  constructor(private readonly userService: userService) {}

  @Post('userId')
  async findById(@Body() userDto: UserDto) {
    try {
      return await this.userService.findUserById(userDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching user by ID',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('userRole')
  async findByRole(@Body() userDto: UserDto) {
    try {
      return await this.userService.findUsersByRole(userDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching users by role',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    @Get('carType')
  async findAllcartype(@Query('brand_id') brand_id?: string) {
    try {
      return await this.userService.findAllcartype(brand_id ? Number(brand_id) : undefined);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching banks',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


    @Get('customerkyc')
  async findAllCustomer() {
    try {
      return await this.userService.findAllCustomer();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching banks',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

      @Get('Driverkyc')
  async findAllDriver() {
    try {
      return await this.userService.findAllDriver();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching banks',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('updateDriver/:phone')
async updateDriver(
  @Param('phone') phone: string,
  @Body() driverDto: any,
) {
  console.log('🟡 Received PUT /updateDriver/:phone request');
  console.log('🆔 phone param:', phone);
  console.log('📦 Request body:', JSON.stringify(driverDto, null, 2));

  if (!phone || !/^\d+$/.test(phone)) {
    throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
  }

  try {
    const result = await this.userService.updateDriver(phone, driverDto);
    console.log('✅ Update result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error in updateDriver:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: error.message || 'Failed to update driver',
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


@Post('Driverkyc')
async getDriverByPhone(@Body() body: { phone: string }) {
  return this.userService.findDriverByPhone(body.phone);
}

@Post('Customerkyc')
async getCustomerByPhone(@Body() body: { phone: string }) {
  return this.userService.findCustomerByPhone(body.phone);
}


  @Get('bank')
  async getAllBanks() {
    try {
      return await this.userService.findAllBanks();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching banks',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('province')
async getAllProvinces() {
  try {
    return await this.userService.findAllProvinces();
  } catch (error) {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching provinces',
        message: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


@Post('district')
async getDistrictsByProvince(@Body() body: ProvinceIdDto) {
  try {
    return await this.userService.findDistrictsByProvinceId(body.pr_id);
  } catch (error) {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching districts',
        message: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}



@Post('villages')
async getVillages(@Body() villageDto: VillageIdDto) {
  try {
    return await this.userService.findVillagesByDistrict(villageDto);
  } catch (error) {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching villages',
        message: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


  @Post('add')
  async addUser(@Body() body: any) {
    try {
      return await this.userService.addUserWithPhoto(body);
    } catch (error) {
      console.error('addUser error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



@Put('update/:phone')
async updateUser(
  @Param('phone') phone: string,
  @Body() userDto: any
) {
  console.log('🟡 Received PUT /update/:phone request');
  console.log('🆔 phone param:', phone);
  console.log('📦 Request body:', JSON.stringify(userDto, null, 2));

  if (!phone || !/^\d+$/.test(phone)) {
    throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
  }

  const result = await this.userService.updateUserWithPhoto(phone, userDto);

  console.log('✅ Update result:', result);
  return result;
}


@Put('update-password/:phone')
async updateUserPassword(
  @Param('phone') phone: string,
  @Body('password') password: string,
) {
  if (!phone || !/^\d+$/.test(phone)) {
    throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
  }
  if (!password || password.trim().length < 6) {
    throw new HttpException('Password must be at least 6 characters', HttpStatus.BAD_REQUEST);
  }
  return await this.userService.updateUserPassword(phone, password);
}



@Put('updateCustomer/:phone')
  async updateCustomer(
    @Param('phone') phone: string,
    @Body() userDto: any,
  ) {
    console.log('🟡 Received PUT /updateCustomer/:phone request');
    console.log('🆔 phone param:', phone);
    console.log('📦 Request body:', JSON.stringify(userDto, null, 2));

    if (!phone || !/^\d+$/.test(phone)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.userService.updateCustomer(phone, userDto);
      console.log('✅ Update result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in updateCustomer:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to update customer',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  @Post('uploadProfile')
  async uploadProfileImage(@Body() dto: ProfileImageDto) {
    return this.userService.addProfileImage(dto);
  }


  //  @Post('getProfileImage')
  // async getProfileImage(@Body() dto: CustomerIdDto) {
  //   return this.userService.getProfileImageByCustomerId(dto.phone);
  // }


  @Post('getProfileImage')
async getProfileImage(@Body() dto: { phone: number; role: string }) {
  return this.userService.getProfileImageByCustomerId(dto);
}


  //    @Post('getProfiledriver')
  // async getProfiledriver(@Body() dto: CustomerIdDto) {
  //   return this.userService.getProfiledriver(dto.phone);
  // }

  @Post('getProfiledriver')
async getDriverProfile(@Body() body: { phone: number; role?: string }) {
  return this.userService.getProfiledriver(body);
}

  @Post('getParameter')
  async getParameter(@Body() body: { name: string }) {
    return this.userService.getParameter(body);
  }

  @Post('getAllParameters')
  async getAllParameters() {
    return this.userService.getAllParameters();
  }

  @Post('updateParameter')
  async updateParameter(@Body() body: { name: string; value: string }) {
    return this.userService.updateParameter(body);
  }


}

