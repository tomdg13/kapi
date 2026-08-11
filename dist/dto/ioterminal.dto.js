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
exports.FindTerminalsByExpireDateDto = exports.FindTerminalsBySimDto = exports.FindTerminalsBySerialDto = exports.CheckTerminalCodeDto = exports.FindTerminalsByGroupDto = exports.FindTerminalsByMerchantDto = exports.FindTerminalsByCompanyAndStoreDto = exports.FindTerminalsByStoreDto = exports.TerminalStatsDto = exports.BulkCreateIoterminalDto = exports.FindTerminalsByIdsResponseDto = exports.IoterminalResponseDto = exports.FindTerminalsByIdsDto = exports.FindTerminalByIdDto = exports.IoterminalDto = exports.UpdateTerminalApprovalDto = exports.UpdateIoterminalDto = exports.CreateIoterminalDto = exports.BaseIoterminalDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mapped_types_1 = require("@nestjs/mapped-types");
class BaseIoterminalDto {
}
exports.BaseIoterminalDto = BaseIoterminalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "terminal_pdf", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'PDF filename cannot exceed 255 characters' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "pdf_filename", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Store ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Store ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIoterminalDto.prototype, "store_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Merchant ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Merchant ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIoterminalDto.prototype, "merchant_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIoterminalDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIoterminalDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'Terminal name cannot exceed 255 characters' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "terminal_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Terminal code cannot exceed 50 characters' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/i, { message: 'Terminal code must contain only letters, numbers, underscores, and hyphens' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "terminal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Phone number cannot exceed 20 characters' }),
    (0, class_validator_1.Matches)(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid phone number' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Serial number cannot exceed 100 characters' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "serial_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'SIM number cannot exceed 50 characters' }),
    (0, class_validator_1.Matches)(/^[0-9A-F]{8,}$/i, { message: 'SIM number must be at least 8 characters' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "sim_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Expire date must be a valid date in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "expire_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Create by cannot exceed 20 characters' }),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "create_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseIoterminalDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'User ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'User ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseIoterminalDto.prototype, "user_id", void 0);
class CreateIoterminalDto extends BaseIoterminalDto {
}
exports.CreateIoterminalDto = CreateIoterminalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Store ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Store ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateIoterminalDto.prototype, "store_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Company ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateIoterminalDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Terminal name is required' }),
    (0, class_validator_1.IsString)({ message: 'Terminal name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Terminal name cannot exceed 255 characters' }),
    __metadata("design:type", String)
], CreateIoterminalDto.prototype, "terminal_name", void 0);
class UpdateIoterminalDto extends (0, mapped_types_1.PartialType)(BaseIoterminalDto) {
}
exports.UpdateIoterminalDto = UpdateIoterminalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['pending', 'approved', 'rejected', 'reapproved']),
    __metadata("design:type", String)
], UpdateIoterminalDto.prototype, "approval_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateIoterminalDto.prototype, "approve1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateIoterminalDto.prototype, "approve2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateIoterminalDto.prototype, "approved_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateIoterminalDto.prototype, "approved_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIoterminalDto.prototype, "rejection_reason", void 0);
class UpdateTerminalApprovalDto {
}
exports.UpdateTerminalApprovalDto = UpdateTerminalApprovalDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['pending', 'approved', 'rejected', 'reapproved']),
    __metadata("design:type", String)
], UpdateTerminalApprovalDto.prototype, "approval_status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateTerminalApprovalDto.prototype, "approved_by", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTerminalApprovalDto.prototype, "approved_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTerminalApprovalDto.prototype, "rejection_reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateTerminalApprovalDto.prototype, "approve1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateTerminalApprovalDto.prototype, "approve2", void 0);
class IoterminalDto {
}
exports.IoterminalDto = IoterminalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Store ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Store ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IoterminalDto.prototype, "store_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Merchant ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Merchant ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IoterminalDto.prototype, "merchant_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IoterminalDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IoterminalDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], IoterminalDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IoterminalDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Limit must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], IoterminalDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)([
        'terminal_name',
        'terminal_code',
        'created_date',
        'updated_date',
        'store_id',
        'merchant_id',
        'group_id',
        'company_id',
        'serial_number',
        'sim_number',
        'expire_date',
        'approval_status'
    ]),
    __metadata("design:type", String)
], IoterminalDto.prototype, "sort_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC']),
    __metadata("design:type", String)
], IoterminalDto.prototype, "sort_order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['pending', 'approved', 'rejected', 'reapproved']),
    __metadata("design:type", String)
], IoterminalDto.prototype, "approval_status", void 0);
class FindTerminalByIdDto {
}
exports.FindTerminalByIdDto = FindTerminalByIdDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'ID must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'ID must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalByIdDto.prototype, "id", void 0);
class FindTerminalsByIdsDto {
}
exports.FindTerminalsByIdsDto = FindTerminalsByIdsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Terminal IDs array is required' }),
    (0, class_validator_1.IsArray)({ message: 'Terminal IDs must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one terminal ID is required' }),
    (0, class_validator_1.IsNumber)({}, { each: true, message: 'Each terminal ID must be a number' }),
    (0, class_validator_1.IsPositive)({ each: true, message: 'Each terminal ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], FindTerminalsByIdsDto.prototype, "terminalIds", void 0);
class IoterminalResponseDto {
}
exports.IoterminalResponseDto = IoterminalResponseDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IoterminalResponseDto.prototype, "terminal_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IoterminalResponseDto.prototype, "store_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IoterminalResponseDto.prototype, "merchant_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IoterminalResponseDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], IoterminalResponseDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "terminal_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "terminal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "serial_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "sim_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "expire_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "create_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "terminal_image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "image_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "approval_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "approve1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "approve2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "approved_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "approved_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "rejection_reason", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "created_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoterminalResponseDto.prototype, "updated_date", void 0);
class FindTerminalsByIdsResponseDto {
}
exports.FindTerminalsByIdsResponseDto = FindTerminalsByIdsResponseDto;
class BulkCreateIoterminalDto {
}
exports.BulkCreateIoterminalDto = BulkCreateIoterminalDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Terminals array is required' }),
    (0, class_transformer_1.Type)(() => CreateIoterminalDto),
    __metadata("design:type", Array)
], BulkCreateIoterminalDto.prototype, "terminals", void 0);
class TerminalStatsDto {
}
exports.TerminalStatsDto = TerminalStatsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TerminalStatsDto.prototype, "store_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TerminalStatsDto.prototype, "merchant_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TerminalStatsDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TerminalStatsDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TerminalStatsDto.prototype, "date_from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TerminalStatsDto.prototype, "date_to", void 0);
class FindTerminalsByStoreDto {
}
exports.FindTerminalsByStoreDto = FindTerminalsByStoreDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Store ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Store ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Store ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByStoreDto.prototype, "store_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByStoreDto.prototype, "company_id", void 0);
class FindTerminalsByCompanyAndStoreDto {
}
exports.FindTerminalsByCompanyAndStoreDto = FindTerminalsByCompanyAndStoreDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Company ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByCompanyAndStoreDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Store ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Store ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Store ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByCompanyAndStoreDto.prototype, "store_id", void 0);
class FindTerminalsByMerchantDto {
}
exports.FindTerminalsByMerchantDto = FindTerminalsByMerchantDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Merchant ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Merchant ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Merchant ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByMerchantDto.prototype, "merchant_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByMerchantDto.prototype, "company_id", void 0);
class FindTerminalsByGroupDto {
}
exports.FindTerminalsByGroupDto = FindTerminalsByGroupDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Group ID is required' }),
    (0, class_validator_1.IsInt)({ message: 'Group ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Group ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByGroupDto.prototype, "group_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByGroupDto.prototype, "company_id", void 0);
class CheckTerminalCodeDto {
}
exports.CheckTerminalCodeDto = CheckTerminalCodeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Terminal code is required' }),
    (0, class_validator_1.IsString)({ message: 'Terminal code must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Terminal code cannot exceed 50 characters' }),
    __metadata("design:type", String)
], CheckTerminalCodeDto.prototype, "terminal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CheckTerminalCodeDto.prototype, "company_id", void 0);
class FindTerminalsBySerialDto {
}
exports.FindTerminalsBySerialDto = FindTerminalsBySerialDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Serial number is required' }),
    (0, class_validator_1.IsString)({ message: 'Serial number must be a string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Serial number cannot exceed 100 characters' }),
    __metadata("design:type", String)
], FindTerminalsBySerialDto.prototype, "serial_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsBySerialDto.prototype, "company_id", void 0);
class FindTerminalsBySimDto {
}
exports.FindTerminalsBySimDto = FindTerminalsBySimDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'SIM number is required' }),
    (0, class_validator_1.IsString)({ message: 'SIM number must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'SIM number cannot exceed 50 characters' }),
    __metadata("design:type", String)
], FindTerminalsBySimDto.prototype, "sim_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsBySimDto.prototype, "company_id", void 0);
class FindTerminalsByExpireDateDto {
}
exports.FindTerminalsByExpireDateDto = FindTerminalsByExpireDateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Date from must be a valid date in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], FindTerminalsByExpireDateDto.prototype, "date_from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Date to must be a valid date in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], FindTerminalsByExpireDateDto.prototype, "date_to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Company ID must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'Company ID must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByExpireDateDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Days before expiry must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Days before expiry must be 0 or positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FindTerminalsByExpireDateDto.prototype, "days_before_expiry", void 0);
//# sourceMappingURL=ioterminal.dto.js.map