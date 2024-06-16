import { Controller, Get } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}
  @Get()
  sendSms() {
    const from = '+17168995982';
    const to = '+593 96 8144760';
    const body = 'Mensaje de texto';
    return this.twilioService.sendSms(from, to, body);
  }
}
