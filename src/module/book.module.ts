import { Module } from '@nestjs/common';
import { BookController } from 'src/controller/book.controller';
import { BookService } from 'src/service/book.service';

@Module({
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
