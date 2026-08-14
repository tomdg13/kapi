import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  // Configure body parser for larger payloads
  app.use(bodyParser.json({ limit: '30mb' }));
  
  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });
  app.useStaticAssets(join(__dirname, '..', 'image'), {
    prefix: '/image/',
  });
  
  // Configure CORS (single configuration)
  app.enableCors({
    origin: ['https://www.sabaiapp.com', 'https://sabaiapp.com'], // Restricted to known domains
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // Allow cookies/auth headers
  });
  
  // Apply global JWT authentication guard
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);
  app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService, configService));
  
  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  await app.listen(3000);
  console.log('✅ Application is running on: http://localhost:3000');
  console.log('✅ CORS enabled for all origins');
  console.log('✅ Global JWT authentication enabled');
}

bootstrap().catch(error => {
  console.error('❌ Error starting application:', error);
});