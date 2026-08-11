import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private readonly dataSource;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, dataSource: DataSource);
    validateUser(phone: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
