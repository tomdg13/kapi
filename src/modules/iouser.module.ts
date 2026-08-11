import { Module } from '@nestjs/common';
import { IouserController } from 'src/controller/iouser.controller';
import { iouserService } from 'src/service/iouser.service';

@Module({
  controllers: [IouserController],
  providers: [iouserService],
})
export class IouserModule { }

