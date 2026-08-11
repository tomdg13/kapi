import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private readonly dataSource;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, dataSource: DataSource);
    validateUser(userNameOrPhone: string, password: string): Promise<any>;
    validateCustomer(userName: string, password: string): Promise<any>;
    validateDriver(userName: string, password: string): Promise<any>;
    validateiouser(userName: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    Clogin(user: any): Promise<{
        access_token: string;
    }>;
    Dlogin(user: any): Promise<{
        access_token: string;
    }>;
    IOlogin(user: any): Promise<{
        access_token: string;
    }>;
}
