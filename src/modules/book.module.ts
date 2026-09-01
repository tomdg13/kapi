import { Module } from '@nestjs/common';
import { BookController } from 'src/controller/book.controller';
import { BookService } from 'src/service/book.service';
import { TrasactionModule } from './transaction.module';

@Module({
  imports: [TrasactionModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
