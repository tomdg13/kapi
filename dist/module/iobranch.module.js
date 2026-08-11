"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IobranchModule = void 0;
const common_1 = require("@nestjs/common");
const iobranch_controller_1 = require("../controller/iobranch.controller");
const iobranch_service_1 = require("../service/iobranch.service");
let IobranchModule = class IobranchModule {
};
exports.IobranchModule = IobranchModule;
exports.IobranchModule = IobranchModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [iobranch_controller_1.IobranchController],
        providers: [iobranch_service_1.IobranchService],
        exports: [iobranch_service_1.IobranchService],
    })
], IobranchModule);
//# sourceMappingURL=iobranch.module.js.map