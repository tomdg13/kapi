import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        phone: string;
        password: string;
    }): Promise<{
        responseCode: string;
        message: string;
        data: {
            access_token: string;
        };
    }>;
}
