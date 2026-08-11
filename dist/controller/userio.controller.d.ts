import { userioService } from 'src/service/userio.service';
import { UserioDto, CreateUserioDto, UpdateUserioDto } from 'src/dto/userio.dto';
export declare class UserioController {
    private readonly userioService;
    constructor(userioService: userioService);
    findById(userioDto: UserioDto): Promise<any>;
    findByRole(userioDto: UserioDto): Promise<any>;
    addUserio(createUserioDto: CreateUserioDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateUserio(phone: string, updateUserioDto: UpdateUserioDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteUserio(phone: string): Promise<{
        status: string;
        message: string;
    }>;
    healthCheck(): Promise<{
        status: string;
        message: string;
        timestamp: string;
    }>;
}
