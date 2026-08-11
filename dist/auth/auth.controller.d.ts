import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        userName: string;
        password: string;
    }): Promise<{
        responseCode: string;
        message: string;
        data: {
            access_token: string;
        };
    }>;
    loginCustomer(loginDto: {
        userName: string;
        password: string;
    }): Promise<{
        responseCode: string;
        message: string;
        data: {
            access_token: string;
        };
    }>;
    loginDriver(loginDto: {
        userName: string;
        password: string;
    }): Promise<{
        responseCode: string;
        message: string;
        data: {
            access_token: string;
        };
    }>;
    loginIOUser(loginDto: {
        userName: string;
        password: string;
    }): Promise<{
        responseCode: string;
        message: string;
        data: {
            access_token: string;
        };
    }>;
}
