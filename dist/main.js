"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const bodyParser = require("body-parser");
const core_2 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.use(bodyParser.json({ limit: '30mb' }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/public',
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'image'), {
        prefix: '/image/',
    });
    app.enableCors({
        origin: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
    });
    const reflector = app.get(core_2.Reflector);
    const jwtService = app.get(jwt_1.JwtService);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector, jwtService, configService));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(3000);
    console.log('✅ Application is running on: http://localhost:3000');
    console.log('✅ CORS enabled for all origins');
    console.log('✅ Global JWT authentication enabled');
}
bootstrap().catch(error => {
    console.error('❌ Error starting application:', error);
});
//# sourceMappingURL=main.js.map