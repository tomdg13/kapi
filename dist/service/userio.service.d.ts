import { CreateUserioDto, UpdateUserioDto, UserioDto } from 'src/dto/userio.dto';
import { DataSource } from 'typeorm';
export declare class userioService {
    private dataSource;
    constructor(dataSource: DataSource);
    findUserioById(dto: UserioDto): Promise<any>;
    findUseriosByRole(dto: UserioDto): Promise<any>;
    addUserioWithPhoto(userioDto: CreateUserioDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateUserioWithPhoto(phone: string, userioDto: UpdateUserioDto): Promise<{
        status: string;
        message: string;
    }>;
    private saveImage;
    private deleteImage;
    private parseBase64Image;
    private getFileExtension;
    deleteUserio(phone: string): Promise<{
        status: string;
        message: string;
    }>;
}
