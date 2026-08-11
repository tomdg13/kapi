import { Module } from '@nestjs/common';
import { IoroleController } from '../controller/iorole.controller';
import { IoroleService } from '../service/iorole.service';

@Module({
  controllers: [IoroleController],
  providers: [IoroleService],
  exports: [IoroleService], // Export so other modules can use it
})
export class IoroleModule {}