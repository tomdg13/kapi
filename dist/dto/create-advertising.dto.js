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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisingFilterDto = exports.UpdateAdvertisingDto = exports.CreateAdvertisingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateAdvertisingDto {
}
exports.CreateAdvertisingDto = CreateAdvertisingDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Advertising note must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Advertising note is required' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Advertising note cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateAdvertisingDto.prototype, "advertising_note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Advertising photo must be a base64 string' }),
    (0, class_validator_1.Matches)(/^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/, { message: 'Invalid base64 image format. Supported formats: jpeg, jpg, png, gif, webp' }),
    __metadata("design:type", String)
], CreateAdvertisingDto.prototype, "advertising_photo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Advertising index must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0, { message: 'Advertising index must be 0 or greater' }),
    (0, class_validator_1.Max)(9999, { message: 'Advertising index cannot exceed 9999' }),
    __metadata("design:type", Number)
], CreateAdvertisingDto.prototype, "advertising_index", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Advertising status must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Advertising status is required' }),
    (0, class_validator_1.IsIn)(['active', 'inactive', 'pending', 'expired'], {
        message: 'Advertising status must be one of: active, inactive, pending, expired'
    }),
    __metadata("design:type", String)
], CreateAdvertisingDto.prototype, "advertising_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Advertising link must be a string' }),
    (0, class_validator_1.IsUrl)({}, { message: 'Advertising link must be a valid URL' }),
    (0, class_validator_1.MaxLength)(2048, { message: 'Advertising link cannot exceed 2048 characters' }),
    __metadata("design:type", String)
], CreateAdvertisingDto.prototype, "advertising_link", void 0);
class UpdateAdvertisingDto {
}
exports.UpdateAdvertisingDto = UpdateAdvertisingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Advertising note must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Advertising note cannot be empty when provided' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Advertising note cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], UpdateAdvertisingDto.prototype, "advertising_note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Advertising photo must be a base64 string' }),
    (0, class_validator_1.Matches)(/^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/, { message: 'Invalid base64 image format. Supported formats: jpeg, jpg, png, gif, webp' }),
    __metadata("design:type", String)
], UpdateAdvertisingDto.prototype, "advertising_photo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Advertising index must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0, { message: 'Advertising index must be 0 or greater' }),
    (0, class_validator_1.Max)(9999, { message: 'Advertising index cannot exceed 9999' }),
    __metadata("design:type", Number)
], UpdateAdvertisingDto.prototype, "advertising_index", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Advertising status must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Advertising status cannot be empty when provided' }),
    (0, class_validator_1.IsIn)(['active', 'inactive', 'pending', 'expired'], {
        message: 'Advertising status must be one of: active, inactive, pending, expired'
    }),
    __metadata("design:type", String)
], UpdateAdvertisingDto.prototype, "advertising_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Advertising link must be a string' }),
    (0, class_validator_1.IsUrl)({}, { message: 'Advertising link must be a valid URL' }),
    (0, class_validator_1.MaxLength)(2048, { message: 'Advertising link cannot exceed 2048 characters' }),
    __metadata("design:type", String)
], UpdateAdvertisingDto.prototype, "advertising_link", void 0);
class AdvertisingFilterDto {
}
exports.AdvertisingFilterDto = AdvertisingFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Status filter must be a string' }),
    (0, class_validator_1.IsIn)(['active', 'inactive', 'pending', 'expired'], {
        message: 'Status must be one of: active, inactive, pending, expired'
    }),
    __metadata("design:type", String)
], AdvertisingFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Limit must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    __metadata("design:type", Number)
], AdvertisingFilterDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Offset must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0, { message: 'Offset must be 0 or greater' }),
    __metadata("design:type", Number)
], AdvertisingFilterDto.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Sort by must be a string' }),
    (0, class_validator_1.IsIn)(['advertising_date', 'advertising_index', 'advertising_status'], {
        message: 'Sort by must be one of: advertising_date, advertising_index, advertising_status'
    }),
    __metadata("design:type", String)
], AdvertisingFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Sort order must be a string' }),
    (0, class_validator_1.IsIn)(['ASC', 'DESC', 'asc', 'desc'], {
        message: 'Sort order must be ASC or DESC'
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toUpperCase()),
    __metadata("design:type", String)
], AdvertisingFilterDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-advertising.dto.js.map