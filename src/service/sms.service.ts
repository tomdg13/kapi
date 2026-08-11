import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private accessToken: string | null = null;
    private tokenExpiryTime: number | null = null;

    constructor(private readonly httpService: HttpService) {}

    private getClientConfig() {
        return {
            clientId: "16996090398809808",
            secret: "ed3406be-069e-49b6-b782-75b5c942f787",
            grantType: "client_credentials",
            scope: "Telbiz_API_SCOPE openid profile offline_access",
            baseUrl: "https://api.telbiz.la",
        };
    }

    async getAccessToken(): Promise<string> {
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
        const response = await firstValueFrom(
            this.httpService.post(tokenUrl, requestBody, {
                headers: { "Content-Type": "application/json" },
            }),
        );
        if (response.data.success) {
            this.accessToken = response.data.accessToken;
            this.tokenExpiryTime = Date.now() + (response.data.expire - 300) * 1000;
            this.logger.log("Successfully obtained access token");
            return this.accessToken;
        }
        throw new HttpException("Failed to get access token: " + response.data.message, HttpStatus.UNAUTHORIZED);
    }

    async makeAuthenticatedRequest(endpoint: string, method: string = "GET", data?: any): Promise<any> {
        const token = await this.getAccessToken();
        const config = this.getClientConfig();
        const url = config.baseUrl + endpoint;
        const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
        try {
            let response: any;
            if (method === "GET") response = await firstValueFrom(this.httpService.get(url, { headers }));
            else if (method === "POST") response = await firstValueFrom(this.httpService.post(url, data, { headers }));
            else if (method === "PUT") response = await firstValueFrom(this.httpService.put(url, data, { headers }));
            else if (method === "DELETE") response = await firstValueFrom(this.httpService.delete(url, { headers }));
            return response.data;
        } catch (error) {
            const detail = error?.response?.data || error.message;
            this.logger.error("Error making " + method + " request to " + endpoint + ":", JSON.stringify(detail));
            throw new HttpException("API request failed: " + JSON.stringify(detail), HttpStatus.BAD_REQUEST);
        }
    }

    async sendSMS(smsData: TelbizSmsRequest, subject: string = "Sabaikee-App"): Promise<TelbizSmsResponse> {
        const endpoint = "/api/v1/smsservice/newtransaction?subject=" + encodeURIComponent(subject);
        this.logger.log("Sending SMS to " + smsData.phone);
        this.logger.log("SMS payload: " + JSON.stringify(smsData));
        const response = await this.makeAuthenticatedRequest(endpoint, "POST", smsData);
        this.logger.log("SMS sent successfully. Status: " + response.response.code);
        return response;
    }
}

export interface TelbizSmsRequest {
    title: string;
    phone: string;
    message: string;
}

export interface TelbizSmsResponse {
    response: {
        code: string;
        message: string;
        success: boolean;
        detail: string;
    };
    key: {
        partitionKey: string;
        rangeKey: string;
    };
}
