import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly twilioClient: Twilio;
  private accountSid: string;
  private authToken: string;
  private twilioNumber: string;
  private myNumber: string;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    this.authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    this.myNumber = this.configService.get<string>('MY_NUMBER');
    this.twilioClient = new Twilio(this.accountSid, this.authToken);
  }

  async sendSms(body: string, to?: string) {
    const toNumber = to ?? this.myNumber;
    const message = await this.twilioClient.messages.create({
      body,
      from: this.twilioNumber,
      to: toNumber,
    });
    return message;
  }
}
