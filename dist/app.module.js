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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./auth/auth.module");
const jwt_middleware_1 = require("./auth/middleware/jwt.middleware");
const test_module_1 = require("./modules/test.module");
const user_module_1 = require("./modules/user.module");
const car_module_1 = require("./modules/car.module");
const book_module_1 = require("./modules/book.module");
const customer_module_1 = require("./modules/customer.module");
const driver_module_1 = require("./modules/driver.module");
const sms_module_1 = require("./modules/sms.module");
const banner_module_1 = require("./modules/banner.module");
const advertising_module_1 = require("./modules/advertising.module");
const transaction_module_1 = require("./modules/transaction.module");
const iouser_module_1 = require("./modules/iouser.module");
const ioproduct_module_1 = require("./modules/ioproduct.module");
const ioinventory_module_1 = require("./modules/ioinventory.module");
const iolocation_module_1 = require("./modules/iolocation.module");
const iobranch_module_1 = require("./modules/iobranch.module");
const iovendor_module_1 = require("./modules/iovendor.module");
const iostore_module_1 = require("./modules/iostore.module");
const iogroup_module_1 = require("./modules/iogroup.module");
const iomerchant_module_1 = require("./modules/iomerchant.module");
const ioterminal_module_1 = require("./modules/ioterminal.module");
const iocompany_module_1 = require("./modules/iocompany.module");
const ioview_module_1 = require("./modules/ioview.module");
const settlement_details_module_1 = require("./modules/settlement_details.module");
const payment_system_module_1 = require("./modules/payment-system/payment-system.module");
const iorole_module_1 = require("./modules/iorole.module");
const permission_module_1 = require("./modules/permission.module");
let AppModule = class AppModule {
    constructor(connection) {
        this.connection = connection;
    }
    configure(consumer) {
        consumer.apply(jwt_middleware_1.JwtMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                name: 'default',
                type: 'mysql',
                host: '209.97.172.105',
                port: 3306,
                username: 'admintra',
                password: 'miN@!2025',
                database: 'KDB',
            }),
            schedule_1.ScheduleModule.forRoot(),
            iorole_module_1.IoroleModule,
            payment_system_module_1.PaymentSystemModule, permission_module_1.PermissionModule,
            ioview_module_1.IoviewModule, settlement_details_module_1.SettlementDetailsModule,
            iouser_module_1.IouserModule, ioproduct_module_1.IoProductModule, ioinventory_module_1.IoInventoryModule, iolocation_module_1.IoLocationModule, iobranch_module_1.IobranchModule, iovendor_module_1.IovendorModule, iostore_module_1.IoStoreModule, iogroup_module_1.IogroupModule, iomerchant_module_1.IomerchantModule, ioterminal_module_1.IoterminalModule, iocompany_module_1.IocompanyModule,
            auth_module_1.UserAuthModule, test_module_1.TestModule, user_module_1.UserModule, car_module_1.CarModule, book_module_1.BookModule, customer_module_1.CustomerModule, driver_module_1.DriverModule, sms_module_1.SmsModule, banner_module_1.BannerModule, advertising_module_1.AdvertisingModule, transaction_module_1.TrasactionModule
        ],
        controllers: [],
    }),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppModule);
//# sourceMappingURL=app.module.js.map