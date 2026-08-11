import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import { userService } from 'src/service/user.service';

@Module({
  controllers: [UserController],
  providers: [userService],
})
export class UserModule { }

