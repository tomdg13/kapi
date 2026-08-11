import { Module } from '@nestjs/common';
import { PermissionController } from 'src/controller/permission.controller';
import { PermissionService } from 'src/service/permission.service';



@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService], // Export so other modules can use it
})
export class PermissionModule {}