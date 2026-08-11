
import { Module } from "@nestjs/common";
import { SmsService } from "../service/sms.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [SmsService],
})
export class SmsModule { }