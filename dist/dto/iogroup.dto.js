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
exports.GroupStatsDto = exports.BulkCreateIogroupDto = exports.IogroupResponseDto = exports.FindGroupByIdDto = exports.IogroupDto = exports.UpdateIogroupDto = exports.CreateIogroupDto = exports.BaseIogroupDto = exports.GroupType = exports.GroupStatus = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mapped_types_1 = require("@nestjs/mapped-types");
var GroupStatus;
(function (GroupStatus) {
    GroupStatus["ACTIVE"] = "active";
    GroupStatus["INACTIVE"] = "inactive";
    GroupStatus["PENDING"] = "pending";
    GroupStatus["SUSPENDED"] = "suspended";
})(GroupStatus || (exports.GroupStatus = GroupStatus = {}));
var GroupType;
(function (GroupType) {
    GroupType["RETAIL"] = "retail";
    GroupType["WHOLESALE"] = "wholesale";
    GroupType["FRANCHISE"] = "franchise";
    GroupType["CORPORATE"] = "corporate";
})(GroupType || (exports.GroupType = GroupType = {}));
class BaseIogroupDto {
}
exports.BaseIogroupDto = BaseIogroupDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIogroupDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "group_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/i, { message: 'Group code must contain only letters, numbers, underscores, and hyphens' }),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "group_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "group_manager", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid phone number' }),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid mobile number' }),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[0-9]{3,10}$/, { message: 'Postal code must be 3-10 digits' }),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "postal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GroupType, { message: 'Group type must be one of: retail, wholesale, franchise, corporate' }),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "group_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GroupStatus, { message: 'Status must be one of: active, inactive, pending, suspended' }),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "opening_hours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Square footage must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIogroupDto.prototype, "square_footage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'User ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'User ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIogroupDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'UPI percentage must have at most 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'UPI percentage cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'UPI percentage cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIogroupDto.prototype, "upi_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Visa percentage must have at most 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'Visa percentage cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Visa percentage cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIogroupDto.prototype, "visa_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Master percentage must have at most 2 decimal places' }),
    (0, class_validator_1.Min)(0, { message: 'Master percentage cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Master percentage cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIogroupDto.prototype, "master_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIogroupDto.prototype, "account", void 0);
class CreateIogroupDto extends BaseIogroupDto {
}
exports.CreateIogroupDto = CreateIogroupDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Company ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateIogroupDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Group name is required' }),
    (0, class_validator_1.IsString)({ message: 'Group name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Group name cannot exceed 255 characters' }),
    __metadata("design:type", String)
], CreateIogroupDto.prototype, "group_name", void 0);
class UpdateIogroupDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(BaseIogroupDto, [])) {
}
exports.UpdateIogroupDto = UpdateIogroupDto;
class IogroupDto {
}
exports.IogroupDto = IogroupDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GroupStatus, { message: 'Status must be one of: active, inactive, pending, suspended' }),
    __metadata("design:type", String)
], IogroupDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IogroupDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GroupType, { message: 'Group type must be one of: retail, wholesale, franchise, corporate' }),
    __metadata("design:type", String)
], IogroupDto.prototype, "group_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], IogroupDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IogroupDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Limit must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IogroupDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['group_name', 'group_code', 'created_date', 'updated_date'], {
        message: 'Sort field must be one of: group_name, group_code, created_date, updated_date'
    }),
    __metadata("design:type", String)
], IogroupDto.prototype, "sort_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' }),
    __metadata("design:type", String)
], IogroupDto.prototype, "sort_order", void 0);
class FindGroupByIdDto {
}
exports.FindGroupByIdDto = FindGroupByIdDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'ID must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'ID must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindGroupByIdDto.prototype, "id", void 0);
class IogroupResponseDto {
}
exports.IogroupResponseDto = IogroupResponseDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IogroupResponseDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IogroupResponseDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "group_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "group_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "group_manager", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "postal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GroupType),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "group_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GroupStatus),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "opening_hours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IogroupResponseDto.prototype, "square_footage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "group_image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "image_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IogroupResponseDto.prototype, "upi_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IogroupResponseDto.prototype, "visa_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IogroupResponseDto.prototype, "master_percentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "account", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "created_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IogroupResponseDto.prototype, "updated_date", void 0);
class BulkCreateIogroupDto {
}
exports.BulkCreateIogroupDto = BulkCreateIogroupDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Groups array is required' }),
    (0, class_transformer_1.Type)(() => CreateIogroupDto),
    __metadata("design:type", Array)
], BulkCreateIogroupDto.prototype, "groups", void 0);
class GroupStatsDto {
}
exports.GroupStatsDto = GroupStatsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GroupStatsDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GroupStatsDto.prototype, "date_from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GroupStatsDto.prototype, "date_to", void 0);
//# sourceMappingURL=iogroup.dto.js.map