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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const firstValueFrom_1 = require("rxjs/internal/firstValueFrom");
let SmsService = SmsService_1 = class SmsService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.accessToken = null;
        this.tokenExpiryTime = null;
    }
    getClientConfig() {
        return {
            clientId: "16996090398809808",
            secret: "ed3406be-069e-49b6-b782-75b5c942f787",
            grantType: "client_credentials",
            scope: "Telbiz_API_SCOPE openid profile offline_access",
            baseUrl: "https://api.telbiz.la",
        };
    }
    async getAccessToken() {
        if (this.accessToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime) {
            return this.accessToken;
        }
        const config = this.getClientConfig();
        const tokenUrl = config.baseUrl + "/api/v1/connect/token";
        const requestBody = {
            clientID: config.clientId,
            secret: config.secret,
            grantType: config.grantType,
            scope: config.scope,
        };
        this.logger.log("Requesting new access token from Telbiz API");
        const response = await (0, firstValueFrom_1.firstValueFrom)(this.httpService.post(tokenUrl, requestBody, {
            headers: { "Content-Type": "application/json" },
        }));
        if (response.data.success) {
            this.accessToken = response.data.accessToken;
            this.tokenExpiryTime = Date.now() + (response.data.expire - 300) * 1000;
            this.logger.log("Successfully obtained access token");
            return this.accessToken;
        }
        throw new common_1.HttpException("Failed to get access token: " + response.data.message, common_1.HttpStatus.UNAUTHORIZED);
    }
    async makeAuthenticatedRequest(endpoint, method = "GET", data) {
        const token = await this.getAccessToken();
        const config = this.getClientConfig();
        const url = config.baseUrl + endpoint;
        const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
        try {
            let response;
            if (method === "GET")
                response = await (0, firstValueFrom_1.firstValueFrom)(this.httpService.get(url, { headers }));
            else if (method === "POST")
                response = await (0, firstValueFrom_1.firstValueFrom)(this.httpService.post(url, data, { headers }));
            else if (method === "PUT")
                response = await (0, firstValueFrom_1.firstValueFrom)(this.httpService.put(url, data, { headers }));
            else if (method === "DELETE")
                response = await (0, firstValueFrom_1.firstValueFrom)(this.httpService.delete(url, { headers }));
            return response.data;
        }
        catch (error) {
            const detail = error?.response?.data || error.message;
            this.logger.error("Error making " + method + " request to " + endpoint + ":", JSON.stringify(detail));
            throw new common_1.HttpException("API request failed: " + JSON.stringify(detail), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendSMS(smsData, subject = "Sabaikee-App") {
        const endpoint = "/api/v1/smsservice/newtransaction?subject=" + encodeURIComponent(subject);
        this.logger.log("Sending SMS to " + smsData.phone);
        this.logger.log("SMS payload: " + JSON.stringify(smsData));
        const response = await this.makeAuthenticatedRequest(endpoint, "POST", smsData);
        this.logger.log("SMS sent successfully. Status: " + response.response.code);
        return response;
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SmsService);
//# sourceMappingURL=sms.service.js.map