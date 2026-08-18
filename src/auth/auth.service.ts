import {
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
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

  private async verifyPassword(plainPassword: string, storedHash: string): Promise<{ valid: boolean; needsUpgrade: boolean }> {
    const isMd5 = /^[a-f0-9]{32}$/i.test(storedHash);
    const isSha256 = /^[a-f0-9]{64}$/i.test(storedHash);

    if (isMd5) {
      const md5Hash = crypto.createHash('md5').update(plainPassword).digest('hex');
      const valid = md5Hash === storedHash;
      return { valid, needsUpgrade: valid };
    }

    if (isSha256) {
      const sha256Hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
      const valid = sha256Hash === storedHash;
      return { valid, needsUpgrade: valid };
    }

    const valid = await bcrypt.compare(plainPassword, storedHash);
    return { valid, needsUpgrade: false };
  }

  async validateUser(userNameOrPhone: string, password: string): Promise<any> {
    const connection = this.usersRepository.manager.connection;
    const sql = `SELECT user_id, username, password, role, status, name, email, phone,
    district_id, province_id, village_id, account_bank_id, account_no, account_name, language
    FROM kd_user WHERE username = ? OR phone = ?`;

    try {
      const result = await connection.query(sql, [userNameOrPhone, userNameOrPhone]);
      const user = result[0];

      if (!user || !user.password || !password) {
        throw new UnauthorizedException('Invalid username/phone or password');
      }

      const { valid, needsUpgrade } = await this.verifyPassword(password, user.password);
      if (!valid) {
        throw new UnauthorizedException('Invalid username/phone or password');
      }

      if (needsUpgrade) {
        const newHash = await bcrypt.hash(password, 12);
        await connection.query(`UPDATE kd_user SET password = ? WHERE user_id = ?`, [newHash, user.user_id]);
      }

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

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      console.error('validateUser error:', error);
      throw error;
    }
  }

  async validateCustomer(userName: string, password: string): Promise<any> {
    const sql = `SELECT * FROM kd_customer WHERE username = ? OR email = ? LIMIT 1`;
    const result = await this.usersRepository.manager.connection.query(sql, [userName, userName]);
    const customer = result[0];

    if (!customer || !customer.password || !password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const { valid, needsUpgrade } = await this.verifyPassword(password, customer.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (needsUpgrade) {
      const newHash = await bcrypt.hash(password, 12);
      await this.usersRepository.manager.connection.query(
        `UPDATE kd_customer SET password = ? WHERE customer_id = ?`,
        [newHash, customer.customer_id],
      );
    }

    if (customer.status !== 'active' && customer.status !== 'reset') {
      throw new UnauthorizedException('Customer account not active');
    }

    const { password: _, ...customerWithoutPassword } = customer;
    return { ...customerWithoutPassword, needsPasswordChange: customer.status === 'reset' };
  }

  async validateDriver(userName: string, password: string): Promise<any> {
    const sql = `SELECT * FROM kd_driver WHERE username = ? OR email = ? LIMIT 1`;
    const result = await this.usersRepository.manager.connection.query(sql, [userName, userName]);
    const Driver = result[0];

    if (!Driver || !Driver.password || !password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const { valid, needsUpgrade } = await this.verifyPassword(password, Driver.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (needsUpgrade) {
      const newHash = await bcrypt.hash(password, 12);
      await this.usersRepository.manager.connection.query(
        `UPDATE kd_driver SET password = ? WHERE customer_id = ?`,
        [newHash, Driver.customer_id],
      );
    }

    if (Driver.status !== 'active') {
      throw new UnauthorizedException('Driver account not active');
    }

    const { password: _, ...DriverWithoutPassword } = Driver;
    return DriverWithoutPassword;
  }

  async validateiouser(userName: string, password: string): Promise<any> {
    const sql = `SELECT * FROM io_user WHERE username = ? OR email = ? LIMIT 1`;
    const result = await this.usersRepository.manager.connection.query(sql, [userName, userName]);
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

    const { valid, needsUpgrade } = await this.verifyPassword(password, Driver.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (needsUpgrade) {
      const newHash = await bcrypt.hash(password, 12);
      await this.usersRepository.manager.connection.query(
        `UPDATE io_user SET password = ? WHERE user_id = ?`,
        [newHash, Driver.user_id],
      );
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
    const payload = { userName: user.username, language: user.language, role: user.role, sub: user.customer_id, name: user.name };
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
