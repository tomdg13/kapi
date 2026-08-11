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
exports.FindMerchantsByCompanyAndGroupDto = exports.FindMerchantsByGroupDto = exports.MerchantStatsDto = exports.BulkCreateIomerchantDto = exports.IomerchantResponseDto = exports.FindMerchantByIdDto = exports.IomerchantDto = exports.UpdateIomerchantDto = exports.CreateIomerchantDto = exports.BaseIomerchantDto = exports.MerchantType = exports.MerchantStatus = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mapped_types_1 = require("@nestjs/mapped-types");
var MerchantStatus;
(function (MerchantStatus) {
    MerchantStatus["ACTIVE"] = "active";
    MerchantStatus["INACTIVE"] = "inactive";
    MerchantStatus["PENDING"] = "pending";
    MerchantStatus["SUSPENDED"] = "suspended";
})(MerchantStatus || (exports.MerchantStatus = MerchantStatus = {}));
var MerchantType;
(function (MerchantType) {
    MerchantType["RETAIL"] = "retail";
    MerchantType["WHOLESALE"] = "wholesale";
    MerchantType["FRANCHISE"] = "franchise";
    MerchantType["CORPORATE"] = "corporate";
})(MerchantType || (exports.MerchantType = MerchantType = {}));
class BaseIomerchantDto {
}
exports.BaseIomerchantDto = BaseIomerchantDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIomerchantDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIomerchantDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "merchant_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/i, { message: 'Merchant code must contain only letters, numbers, underscores, and hyphens' }),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "merchant_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "merchant_manager", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid phone number' }),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[0-9]{3,10}$/, { message: 'Postal code must be 3-10 digits' }),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "postal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantType, { message: 'Merchant type must be one of: retail, wholesale, franchise, corporate' }),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "merchant_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantStatus, { message: 'Status must be one of: active, inactive, pending, suspended' }),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "opening_hours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Square footage must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIomerchantDto.prototype, "square_footage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'User ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'User ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIomerchantDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'UPI percentage must have at most 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'UPI percentage cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'UPI percentage cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIomerchantDto.prototype, "upi_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Visa percentage must have at most 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'Visa percentage cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Visa percentage cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIomerchantDto.prototype, "visa_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Master percentage must have at most 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'Master percentage cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Master percentage cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIomerchantDto.prototype, "master_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIomerchantDto.prototype, "account", void 0);
class CreateIomerchantDto extends BaseIomerchantDto {
}
exports.CreateIomerchantDto = CreateIomerchantDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateIomerchantDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Company ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateIomerchantDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Merchant name is required' }),
    (0, class_validator_1.IsString)({ message: 'Merchant name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Merchant name cannot exceed 255 characters' }),
    __metadata("design:type", String)
], CreateIomerchantDto.prototype, "merchant_name", void 0);
class UpdateIomerchantDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(BaseIomerchantDto, [])) {
}
exports.UpdateIomerchantDto = UpdateIomerchantDto;
class IomerchantDto {
}
exports.IomerchantDto = IomerchantDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantStatus, { message: 'Status must be one of: active, inactive, pending, suspended' }),
    __metadata("design:type", String)
], IomerchantDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IomerchantDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IomerchantDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantType, { message: 'Merchant type must be one of: retail, wholesale, franchise, corporate' }),
    __metadata("design:type", String)
], IomerchantDto.prototype, "merchant_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], IomerchantDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IomerchantDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Limit must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IomerchantDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['merchant_name', 'merchant_code', 'created_date', 'updated_date', 'group_id'], {
        message: 'Sort field must be one of: merchant_name, merchant_code, created_date, updated_date, group_id'
    }),
    __metadata("design:type", String)
], IomerchantDto.prototype, "sort_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' }),
    __metadata("design:type", String)
], IomerchantDto.prototype, "sort_order", void 0);
class FindMerchantByIdDto {
}
exports.FindMerchantByIdDto = FindMerchantByIdDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'ID must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'ID must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindMerchantByIdDto.prototype, "id", void 0);
class IomerchantResponseDto {
}
exports.IomerchantResponseDto = IomerchantResponseDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IomerchantResponseDto.prototype, "merchant_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IomerchantResponseDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IomerchantResponseDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "merchant_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "merchant_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "merchant_manager", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "postal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantType),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "merchant_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantStatus),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "opening_hours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IomerchantResponseDto.prototype, "square_footage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "merchant_image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "image_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IomerchantResponseDto.prototype, "upi_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IomerchantResponseDto.prototype, "visa_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IomerchantResponseDto.prototype, "master_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "account", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "created_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IomerchantResponseDto.prototype, "updated_date", void 0);
class BulkCreateIomerchantDto {
}
exports.BulkCreateIomerchantDto = BulkCreateIomerchantDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Merchants array is required' }),
    (0, class_transformer_1.Type)(() => CreateIomerchantDto),
    __metadata("design:type", Array)
], BulkCreateIomerchantDto.prototype, "merchants", void 0);
class MerchantStatsDto {
}
exports.MerchantStatsDto = MerchantStatsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MerchantStatsDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MerchantStatsDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantStatsDto.prototype, "date_from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantStatsDto.prototype, "date_to", void 0);
class FindMerchantsByGroupDto {
}
exports.FindMerchantsByGroupDto = FindMerchantsByGroupDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Group ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindMerchantsByGroupDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindMerchantsByGroupDto.prototype, "company_id", void 0);
class FindMerchantsByCompanyAndGroupDto {
}
exports.FindMerchantsByCompanyAndGroupDto = FindMerchantsByCompanyAndGroupDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Company ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindMerchantsByCompanyAndGroupDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Group ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindMerchantsByCompanyAndGroupDto.prototype, "group_id", void 0);
//# sourceMappingURL=iomerchant.dto.js.map