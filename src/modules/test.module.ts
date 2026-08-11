import { Module } from '@nestjs/common';
import { TestController } from 'src/controller/test.controller';

import { testService } from 'src/service/test.service';
@Module({
  controllers: [TestController],
  providers: [testService],
})
export class TestModule {}
