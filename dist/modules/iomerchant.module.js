"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IomerchantModule = void 0;
const common_1 = require("@nestjs/common");
const iomerchant_controller_1 = require("../controller/iomerchant.controller");
const iomerchant_service_1 = require("../service/iomerchant.service");
let IomerchantModule = class IomerchantModule {
};
exports.IomerchantModule = IomerchantModule;
exports.IomerchantModule = IomerchantModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [iomerchant_controller_1.IoMerchantController],
        providers: [iomerchant_service_1.IoMerchantService],
        exports: [iomerchant_service_1.IoMerchantService],
    })
], IomerchantModule);
//# sourceMappingURL=iomerchant.module.js.map