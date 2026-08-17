import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

//open token
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  
  //open token
  @Public()
  @Post('login')
  async login(@Body() loginDto: { userName: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        loginDto.userName,
        loginDto.password,
      );

      if (user == null) {
        throw new UnauthorizedException('User not found');
      }
      if (user == false) {
        throw new UnauthorizedException('Password incorrect');
      }
      const loginResult = await this.authService.login(user);
      // console.log('Login successful, token generated');
      return {
        responseCode: '00',
        message: 'Login successful',
        data: loginResult,
      };
    } catch (error) {
      // console.error('Login error:', error.message);
      throw error;
    }
  }

  @Public()
  @Post('loginCustomer')
  async loginCustomer(@Body() loginDto: { userName: string; password: string }) {
    try {
      const user = await this.authService.validateCustomer(
        loginDto.userName,
        loginDto.password,
      );

      if (user == null) {
        throw new UnauthorizedException('Customer not found');
      }
      if (user == false) {
        throw new UnauthorizedException('Password incorrect');
      }

      const loginResult = await this.authService.Clogin(user);
      return {
        responseCode: '00',
        message: 'Login successful',
        data: loginResult,
      };
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('loginDriver')
  async loginDriver(@Body() loginDto: { userName: string; password: string }) {
    try {
      const user = await this.authService.validateDriver(
        loginDto.userName,
        loginDto.password,
      );

      if (user == null) {
        throw new UnauthorizedException('Driver not found');
      }
      if (user == false) {
        throw new UnauthorizedException('Password incorrect');
      }

      const loginResult = await this.authService.Dlogin(user);
      return {
        responseCode: '00',
        message: 'Login successful',
        data: loginResult,
      };
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('loginIOUser')
  async loginIOUser(@Body() loginDto: { userName: string; password: string }) {
    try {
      const user = await this.authService.validateiouser(
        loginDto.userName,
        loginDto.password,
      );

      if (user == null) {
        throw new UnauthorizedException('Driver not found');
      }
      if (user == false) {
        throw new UnauthorizedException('Password incorrect');
      }

      const loginResult = await this.authService.IOlogin(user);
      return {
        responseCode: '00',
        message: 'Login successful',
        data: loginResult,
      };
    } catch (error) {
      throw error;
    }
  }

}