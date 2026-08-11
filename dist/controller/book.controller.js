"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const common_1 = require("@nestjs/common");
const book_service_1 = require("../service/book.service");
const create_bookmap_dto_1 = require("../dto/create-bookmap.dto");
let BookController = class BookController {
    constructor(bookService) {
        this.bookService = bookService;
    }
    async bookList(passengerId) {
        return this.bookService.findBooksByPassengerId(passengerId);
    }
    async driverbookList(driverId) {
        return this.bookService.findBooksBydriverId(driverId);
    }
    async getBookingById(id) {
        return this.bookService.findBookingById(id);
    }
    async bookAdd(createBookDto) {
        return this.bookService.addBook(createBookDto);
    }
    async bookUpdate(id, updateBookDto) {
        updateBookDto.book_id = id;
        return this.bookService.updateBook(updateBookDto);
    }
    async markAsRead(body) {
        return this.bookService.markMessageAsRead(body.book_id);
    }
    async addBookMap(dto) {
        return this.bookService.addBookMap(dto);
    }
};
exports.BookController = BookController;
__decorate([
    (0, common_1.Post)('bookList'),
    __param(0, (0, common_1.Body)('passenger_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "bookList", null);
__decorate([
    (0, common_1.Post)('driverbookList'),
    __param(0, (0, common_1.Body)('driver_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "driverbookList", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Post)('bookAdd'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "bookAdd", null);
__decorate([
    (0, common_1.Put)('update/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "bookUpdate", null);
__decorate([
    (0, common_1.Post)('markAsRead'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('addBookMap'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bookmap_dto_1.CreateBookMapDto]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "addBookMap", null);
exports.BookController = BookController = __decorate([
    (0, common_1.Controller)('book'),
    __metadata("design:paramtypes", [book_service_1.BookService])
], BookController);
//# sourceMappingURL=book.controller.js.map