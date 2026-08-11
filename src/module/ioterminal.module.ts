import { Module } from '@nestjs/common';
import { IoTerminalController } from '../controller/ioterminal.controller';
import { IoTerminalService } from '../service/ioterminal.service';

@Module({
  imports: [],
  controllers: [IoTerminalController],
  providers: [IoTerminalService],
  exports: [IoTerminalService],
})
export class IoterminalModule {}