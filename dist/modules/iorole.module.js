"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoroleModule = void 0;
const common_1 = require("@nestjs/common");
const iorole_controller_1 = require("../controller/iorole.controller");
const iorole_service_1 = require("../service/iorole.service");
let IoroleModule = class IoroleModule {
};
exports.IoroleModule = IoroleModule;
exports.IoroleModule = IoroleModule = __decorate([
    (0, common_1.Module)({
        controllers: [iorole_controller_1.IoroleController],
        providers: [iorole_service_1.IoroleService],
        exports: [iorole_service_1.IoroleService],
    })
], IoroleModule);
//# sourceMappingURL=iorole.module.js.map