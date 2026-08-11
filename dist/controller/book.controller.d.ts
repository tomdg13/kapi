import { BookService } from '../service/book.service';
import { CreateBookMapDto } from 'src/dto/create-bookmap.dto';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
    bookList(passengerId: number): Promise<any>;
    driverbookList(driverId: number): Promise<any>;
    getBookingById(id: number): Promise<any>;
    bookAdd(createBookDto: any): Promise<any>;
    bookUpdate(id: number, updateBookDto: any): Promise<any>;
    markAsRead(body: {
        book_id: number;
    }): Promise<any>;
    addBookMap(dto: CreateBookMapDto): Promise<any>;
}
