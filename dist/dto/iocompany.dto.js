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
exports.AdvancedSearchCompanyDto = exports.UpdateCompanyLogoDto = exports.CompanyStatsDto = exports.BulkCreateIocompanyDto = exports.IocompanyResponseDto = exports.FindCompanyByIdDto = exports.IocompanyDto = exports.UpdateIocompanyDto = exports.CreateIocompanyDto = exports.BaseIocompanyDto = exports.CompanyStatus = exports.IsBase64Image = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mapped_types_1 = require("@nestjs/mapped-types");
function IsBase64Image() {
    return (0, class_validator_1.Matches)(/^data:image\/(jpeg|jpg|png|gif|webp|bmp|tiff);base64,/, {
        message: 'Invalid image format. Must be a valid base64 image (jpeg, jpg, png, gif, webp, bmp, or tiff)'
    });
}
exports.IsBase64Image = IsBase64Image;
var CompanyStatus;
(function (CompanyStatus) {
    CompanyStatus["ACTIVE"] = "active";
    CompanyStatus["INACTIVE"] = "inactive";
    CompanyStatus["PENDING"] = "pending";
    CompanyStatus["SUSPENDED"] = "suspended";
})(CompanyStatus || (exports.CompanyStatus = CompanyStatus = {}));
class BaseIocompanyDto {
}
exports.BaseIocompanyDto = BaseIocompanyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "company_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/i, { message: 'Company code must contain only letters, numbers, underscores, and hyphens' }),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "company_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "company_name_en", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "business_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.Matches)(/^[A-Z0-9-]+$/i, { message: 'Tax ID must contain only letters, numbers, and hyphens' }),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "tax_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid phone number' }),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    (0, class_validator_1.IsUrl)({}, { message: 'Please provide a valid website URL' }),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    IsBase64Image(),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "logo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "logo_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "ceo_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)({ message: 'Employee count must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIocompanyDto.prototype, "employee_count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1800, { message: 'Established year must be after 1800' }),
    (0, class_validator_1.Max)(new Date().getFullYear(), { message: 'Established year cannot be in the future' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIocompanyDto.prototype, "established_year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatus, { message: 'Status must be one of: active, inactive, pending, suspended' }),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    IsBase64Image(),
    __metadata("design:type", String)
], BaseIocompanyDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'User ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'User ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIocompanyDto.prototype, "user_id", void 0);
class CreateIocompanyDto extends BaseIocompanyDto {
}
exports.CreateIocompanyDto = CreateIocompanyDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Company name is required' }),
    (0, class_validator_1.IsString)({ message: 'Company name must be a string' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Company name cannot exceed 150 characters' }),
    __metadata("design:type", String)
], CreateIocompanyDto.prototype, "company_name", void 0);
class UpdateIocompanyDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(BaseIocompanyDto, [])) {
}
exports.UpdateIocompanyDto = UpdateIocompanyDto;
class IocompanyDto {
}
exports.IocompanyDto = IocompanyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatus, { message: 'Status must be one of: active, inactive, pending, suspended' }),
    __metadata("design:type", String)
], IocompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IocompanyDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], IocompanyDto.prototype, "business_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], IocompanyDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IocompanyDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Limit must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IocompanyDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['company_name', 'company_code', 'business_type', 'ceo_name', 'established_year', 'employee_count', 'created_at', 'updated_at'], {
        message: 'Sort field must be one of: company_name, company_code, business_type, ceo_name, established_year, employee_count, created_at, updated_at'
    }),
    __metadata("design:type", String)
], IocompanyDto.prototype, "sort_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' }),
    __metadata("design:type", String)
], IocompanyDto.prototype, "sort_order", void 0);
class FindCompanyByIdDto {
}
exports.FindCompanyByIdDto = FindCompanyByIdDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'ID must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'ID must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindCompanyByIdDto.prototype, "id", void 0);
class IocompanyResponseDto {
}
exports.IocompanyResponseDto = IocompanyResponseDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IocompanyResponseDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "company_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "company_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "company_name_en", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "business_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "tax_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "logo_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "logo_full_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "ceo_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IocompanyResponseDto.prototype, "employee_count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IocompanyResponseDto.prototype, "established_year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatus),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IocompanyResponseDto.prototype, "updated_at", void 0);
class BulkCreateIocompanyDto {
}
exports.BulkCreateIocompanyDto = BulkCreateIocompanyDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Companies array is required' }),
    (0, class_transformer_1.Type)(() => CreateIocompanyDto),
    __metadata("design:type", Array)
], BulkCreateIocompanyDto.prototype, "companies", void 0);
class CompanyStatsDto {
}
exports.CompanyStatsDto = CompanyStatsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CompanyStatsDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyStatsDto.prototype, "date_from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyStatsDto.prototype, "date_to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyStatsDto.prototype, "business_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatus),
    __metadata("design:type", String)
], CompanyStatsDto.prototype, "status", void 0);
class UpdateCompanyLogoDto {
}
exports.UpdateCompanyLogoDto = UpdateCompanyLogoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Logo is required' }),
    (0, class_validator_1.IsString)(),
    IsBase64Image(),
    __metadata("design:type", String)
], UpdateCompanyLogoDto.prototype, "logo", void 0);
class AdvancedSearchCompanyDto extends IocompanyDto {
}
exports.AdvancedSearchCompanyDto = AdvancedSearchCompanyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdvancedSearchCompanyDto.prototype, "min_employees", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdvancedSearchCompanyDto.prototype, "max_employees", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdvancedSearchCompanyDto.prototype, "established_from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdvancedSearchCompanyDto.prototype, "established_to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdvancedSearchCompanyDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdvancedSearchCompanyDto.prototype, "city", void 0);
//# sourceMappingURL=iocompany.dto.js.map