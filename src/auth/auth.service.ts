import {
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './users/users.entity';
import { Customer } from './users/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly dataSource: DataSource
  ) { }



  async validateUser(userNameOrPhone: string, password: string): Promise<any> {
    const connection = this.usersRepository.manager.connection;
    const sql = `SELECT user_id, username, password, role, status, name, email, phone,
    district_id, province_id, village_id, account_bank_id, account_no, account_name, language
    FROM kd_user WHERE username = '${userNameOrPhone}' OR phone = '${userNameOrPhone}'`;

    try {
      const result = await connection.query(sql);
      const user = result[0];

      if (!user || !user.password || !password) {
        throw new UnauthorizedException('Invalid username/phone or password');
      }

      // 🔐 MD5 hash input password
      const md5 = (input: string) => crypto.createHash('md5').update(input).digest('hex');
      const hashedPassword = md5(password);

      // 🔑 Check password
      if (user.password !== hashedPassword) {
        throw new UnauthorizedException('Invalid username/phone or password');
      }

      // 📛 Check account status
      switch (user.status) {
        case 'active':
          break; // ok
        case 'reset':
          throw new UnauthorizedException('Reset password required');
        case 'close':
          throw new UnauthorizedException('User is closed');
        default:
          throw new UnauthorizedException('User is not active');
      }

      // ✅ Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      console.error('validateUser error:', error);
      throw error;
    }
  }


  async validateCustomer(userName: string, password: string): Promise<any> {
    const sql = `
    SELECT * FROM kd_customer
    WHERE username = '${userName}' OR email = '${userName}' LIMIT 1
  `;
    const result = await this.usersRepository.manager.connection.query(sql);
    const customer = result[0];

    if (!customer || !customer.password || !password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const md5 = (input: string) => crypto.createHash('md5').update(input).digest('hex');
    const hashedPassword = md5(password);

    if (customer.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (customer.status !== 'active') {
      throw new UnauthorizedException('Customer account not active');
    }

    const { password: _, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }



  async validateDriver(userName: string, password: string): Promise<any> {
    const sql = `
    SELECT * FROM kd_driver
    WHERE username = '${userName}' OR email = '${userName}' LIMIT 1
  `;
    const result = await this.usersRepository.manager.connection.query(sql);
    const Driver = result[0];

    if (!Driver || !Driver.password || !password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const md5 = (input: string) => crypto.createHash('md5').update(input).digest('hex');
    const hashedPassword = md5(password);

    if (Driver.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (Driver.status !== 'active') {
      throw new UnauthorizedException('Driver account not active');
    }

    const { password: _, ...DriverWithoutPassword } = Driver;
    return DriverWithoutPassword;
  }

  async validateiouser(userName: string, password: string): Promise<any> {
    const sql = `
    SELECT * FROM io_user
    WHERE username = '${userName}' OR email = '${userName}' LIMIT 1
  `;
    const result = await this.usersRepository.manager.connection.query(sql);
    const Driver = result[0];

    // Check if user exists first
    if (!Driver) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Check for resetpassword status BEFORE validating password
    if (Driver.status === 'resetpassword') {
      throw new UnauthorizedException('resetpassword');
    }

    // Now check password requirements (after status check)
    if (!Driver.password || !password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const md5 = (input: string) => crypto.createHash('md5').update(input).digest('hex');
    const hashedPassword = md5(password);

    if (Driver.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (Driver.status !== 'active') {
      throw new UnauthorizedException('username account not active');
    }

    const { password: _, ...DriverWithoutPassword } = Driver;
    return DriverWithoutPassword;
  }

  async login(user: any) {
    const payload = { userName: user.username, language: user.language, role: user.role, sub: user.user_id, name: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10h' });
    return {
      access_token: accessToken,
    };
  }

  async Clogin(user: any) {
    const payload = { userName: user.username, language: user.language, role: user.role, sub: user.user_id, name: user.name };
    const accessCToken = this.jwtService.sign(payload, { expiresIn: '10h' });
    return {
      access_token: accessCToken,
    };
  }


  async Dlogin(user: any) {
    const payload = { userName: user.username, language: user.language, role: user.role, sub: user.user_id, name: user.name };
    const accessDToken = this.jwtService.sign(payload, { expiresIn: '10h' });
    return {
      access_token: accessDToken,
    };
  }

  async IOlogin(user: any) {
    const payload = { userName: user.username, language: user.language, role: user.role, sub: user.user_id, name: user.name };
    const accessDToken = this.jwtService.sign(payload, { expiresIn: '10h' });
    return {
      access_token: accessDToken,
    };
  }

}