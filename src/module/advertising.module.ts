import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisingController } from 'src/controller/advertising.controller';
import { AdvertisingService } from 'src/service/advertising.service';
import { Advertising } from 'src/entity/advertising.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Advertising])],
  controllers: [AdvertisingController],
  providers: [AdvertisingService],
})
export class AdvertisingModule {}
