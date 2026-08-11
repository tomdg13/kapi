import { DataSource } from 'typeorm';
export declare class BookService {
    private dataSource;
    constructor(dataSource: DataSource);
    findBooksByUserId(userId?: number): Promise<any>;
    findBooksBydriverId(driverId: number): Promise<any>;
    findBooksByPassengerId(passengerId: number): Promise<any>;
    findBookingById(bookId: number): Promise<any>;
    addBook(dto: any): Promise<any>;
    updateBook(dto: any): Promise<any>;
    markMessageAsRead(bookId: number): Promise<any>;
    addBookMap(dto: any): Promise<any>;
}
