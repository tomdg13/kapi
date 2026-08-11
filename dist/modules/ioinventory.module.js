"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoInventoryModule = void 0;
const common_1 = require("@nestjs/common");
const ioinventory_controller_1 = require("../controller/ioinventory.controller");
const ioinventory_service_1 = require("../service/ioinventory.service");
let IoInventoryModule = class IoInventoryModule {
};
exports.IoInventoryModule = IoInventoryModule;
exports.IoInventoryModule = IoInventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [ioinventory_controller_1.IoInventoryController],
        providers: [ioinventory_service_1.IoInventoryService],
        exports: [ioinventory_service_1.IoInventoryService],
    })
], IoInventoryModule);
//# sourceMappingURL=ioinventory.module.js.map