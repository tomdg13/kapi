import { Controller, Post, Body, Get, Put, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { BookService } from '../service/book.service';
import { CreateBookMapDto } from 'src/dto/create-bookmap.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // POST /book/bookList (body: { passenger_id: 1 })
  @Post('bookList')
  async bookList(@Body('passenger_id') passengerId: number) {
    return this.bookService.findBooksByPassengerId(passengerId);
  }

   @Post('driverbookList')
  async driverbookList(@Body('driver_id') driverId: number) {
    return this.bookService.findBooksBydriverId(driverId);
  }

  @Get(':id')
  async getBookingById(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findBookingById(id);
  }


  @Post('bookAdd')
  async bookAdd(@Body() createBookDto: any) {
    return this.bookService.addBook(createBookDto);
  }

  @Put('update/:id')
  async bookUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: any,
  ) {
    updateBookDto.book_id = id;
    return this.bookService.updateBook(updateBookDto);
  }

   @Post('markAsRead')
  async markAsRead(@Body() body: { book_id: number }) {
    return this.bookService.markMessageAsRead(body.book_id);
  }

  @Post('addBookMap')
  @HttpCode(HttpStatus.CREATED)
  async addBookMap(@Body() dto: CreateBookMapDto) {
    return this.bookService.addBookMap(dto);
  }
  
}
