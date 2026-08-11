"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const crypto = require("crypto");
const common_2 = require("@nestjs/common");
const users_entity_1 = require("./users/users.entity");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService, dataSource) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async validateUser(phone, password) {
        const connection = this.usersRepository.manager.connection;
        const sql = `SELECT user_id, phone, password, role, status, name, email, phone,
    district_id, province_id, village_id, account_bank_id, account_no, account_name, language
    FROM io_user WHERE phone = '${phone}'`;
        try {
            const result = await connection.query(sql);
            const user = result[0];
            if (!user || !user.password || !password) {
                throw new common_2.UnauthorizedException('Invalid phone or password');
            }
            const md5 = (input) => crypto.createHash('md5').update(input).digest('hex');
            const hashedPassword = md5(password);
            if (user.password !== hashedPassword) {
                throw new common_2.UnauthorizedException('Invalid phone or password');
            }
            switch (user.status) {
                case 'active':
                    break;
                case 'reset':
                    throw new common_2.UnauthorizedException('Reset password required');
                case 'close':
                    throw new common_2.UnauthorizedException('User is closed');
                default:
                    throw new common_2.UnauthorizedException('User is not active');
            }
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            console.error('validateUser error:', error);
            throw error;
        }
    }
    async login(user) {
        const payload = { phone: user.phone, language: user.language, role: user.role, sub: user.user_id, name: user.name };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '10h' });
        return {
            access_token: accessToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_3.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map