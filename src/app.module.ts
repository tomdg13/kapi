import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserAuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';
import { TestModule } from './modules/test.module';
import { UserModule } from './modules/user.module';
import { CarModule } from './modules/car.module';
import { BookModule } from './modules/book.module';
import { CustomerModule } from './modules/customer.module';
import { DriverModule } from './modules/driver.module';
import { SmsModule } from './modules/sms.module';
import { BannerModule } from './modules/banner.module';
import { AdvertisingModule } from './modules/advertising.module';
import { TrasactionModule } from './modules/transaction.module';
import { IouserModule } from './modules/iouser.module';
import { IoProductModule } from './modules/ioproduct.module';
import { IoInventoryModule } from './modules/ioinventory.module';
import { IoLocationModule } from './modules/iolocation.module';
import { IobranchModule } from './modules/iobranch.module';
import { IovendorModule } from './modules/iovendor.module';
import { IoStoreModule } from './modules/iostore.module';
import { IogroupModule } from './modules/iogroup.module';
import { IomerchantModule } from './modules/iomerchant.module';
import { IoterminalModule } from './modules/ioterminal.module';
import { IocompanyModule } from './modules/iocompany.module';
import { IoviewModule } from './modules/ioview.module';
import { SettlementDetailsController } from './controller/settlement_details.controller';
import { SettlementDetailsModule } from './modules/settlement_details.module';
import { PaymentSystemModule } from './modules/payment-system/payment-system.module';
import { IoroleModule } from './modules/iorole.module';
import { PermissionModule } from './modules/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: '209.97.172.105',
      port: 3306,
      username: 'admintra',
      password: 'miN@!2025',
      database: 'KDB',
    }),
    ScheduleModule.forRoot(),
    IoroleModule,
    PaymentSystemModule,PermissionModule,
    IoviewModule,SettlementDetailsModule,
    IouserModule, IoProductModule,IoInventoryModule,IoLocationModule,IobranchModule,IovendorModule,IoStoreModule,IogroupModule,IomerchantModule,IoterminalModule,IocompanyModule,
    UserAuthModule, TestModule, UserModule,CarModule , BookModule ,CustomerModule , DriverModule,SmsModule ,BannerModule, AdvertisingModule ,TrasactionModule 
    // Apply to all model --------------------------------------------------------------------------------------------------------
  ],
  controllers: [],
})
export class AppModule {
  constructor(private readonly connection: DataSource) { }
  // open token
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*'); // Apply to all routes
  }
}
