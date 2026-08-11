"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserioModule = void 0;
const common_1 = require("@nestjs/common");
const userio_controller_1 = require("../controller/userio.controller");
const userio_service_1 = require("../service/userio.service");
let UserioModule = class UserioModule {
};
exports.UserioModule = UserioModule;
exports.UserioModule = UserioModule = __decorate([
    (0, common_1.Module)({
        controllers: [userio_controller_1.UserioController],
        providers: [userio_service_1.userioService],
    })
], UserioModule);
//# sourceMappingURL=userio.module.js.map