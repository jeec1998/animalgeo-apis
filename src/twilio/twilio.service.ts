// src/twilio/twilio.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio.Twilio;
  private serviceSid: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.serviceSid = this.configService.get<string>('VERIFY_SERVICE_SID');
    this.twilioClient = Twilio(accountSid, authToken);
  }

  async sendSms(from: string, to: string, body: string){
    const message = await this.twilioClient.messages   
    .create({
      body,      
      from,      
      to   
    }); 
    return message;   
  }
  async sendVerificationCode(phoneNumber: string) {
    return this.twilioClient.verify.v2.services(this.serviceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
  }

  async verifyCode(phoneNumber: string, code: string) {
    return this.twilioClient.verify.v2.services(this.serviceSid)
      .verificationChecks
      .create({ to: phoneNumber, code });
  }
}
