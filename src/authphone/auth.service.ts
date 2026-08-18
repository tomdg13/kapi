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
      const hash = crypto.createHash('md5').update(plainPassword).digest('hex');
      const valid = hash === storedHash;
      return { valid, needsUpgrade: valid };
    }

    if (isSha256) {
      const hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
      const valid = hash === storedHash;
      return { valid, needsUpgrade: valid };
    }

    const valid = await bcrypt.compare(plainPassword, storedHash);
    return { valid, needsUpgrade: false };
  }

  async validateUser(phone: string, password: string): Promise<any> {
    const connection = this.usersRepository.manager.connection;
    const sql = `SELECT user_id, phone, password, role, status, name, email, phone,
    district_id, province_id, village_id, account_bank_id, account_no, account_name, language
    FROM io_user WHERE phone = ?`;

    try {
      const result = await connection.query(sql, [phone]);
      const user = result[0];

      if (!user || !user.password || !password) {
        throw new UnauthorizedException('Invalid phone or password');
      }

      const { valid, needsUpgrade } = await this.verifyPassword(password, user.password);
      if (!valid) {
        throw new UnauthorizedException('Invalid phone or password');
      }

      if (needsUpgrade) {
        const newHash = await bcrypt.hash(password, 12);
        await connection.query(`UPDATE io_user SET password = ? WHERE user_id = ?`, [newHash, user.user_id]);
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

  async login(user: any) {
    const payload = { phone: user.phone, language: user.language, role: user.role, sub: user.user_id, name: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10h' });
    return {
      access_token: accessToken,
    };
  }

}
