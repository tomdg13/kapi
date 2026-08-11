import { Module } from '@nestjs/common';
import { UserioController } from 'src/controller/userio.controller';
import { userioService } from 'src/service/userio.service';


@Module({
  controllers: [UserioController],
  providers: [userioService],
})
export class UserioModule { }

