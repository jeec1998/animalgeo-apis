import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const speakeasy = require('speakeasy');
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { TwilioService } from 'src/twilio/twilio.service';
import { UserService } from 'src/user/models/user.service';
import { UserDocument } from 'src/user/models/user.model';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly userService: UserService,
  ) {}
  generateTwoFactorAuthenticationSecret(email) {
    const secret = speakeasy.generateSecret({
      name: `AnimalGeo:${email}`,
    });

    return secret as {
      ascii: string;
      hex: string;
      base32: string;
      otpauth_url: string;
    };
  }

  generateTwoFactorAuthenticationToken(secret) {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
    });
  }

  async validateTwoFactorAuthenticationToken(token, secret) {
    if (await bcrypt.compare(token, secret)) {
      return true;
    }
    return false;
  }

  async sendCodeToUser(user: UserDocument) {
    const code = this.generateRandomNumber();
    try {
      const messageBody = `Este es tu código secreto ${code}`;
      await this.twilioService.sendSms(messageBody, user.phoneNumber);
      const secret = await bcrypt.hash(code.toString(), 10);
      await this.userService.update2FASecret(
        user._id.toString(),
        secret.toString(),
      );
    } catch (error) {
      console.error('Error generating 2FA:', error);
    }
  }

  generateRandomNumber() {
    // Genera un número aleatorio seguro de 4 bytes
    const randomBuffer = crypto.randomBytes(4);
    // Convierte el buffer a un número entero sin signo de 32 bits
    const randomNumber = randomBuffer.readUInt32BE(0);
    // Ajusta el número al rango de 6 dígitos (100000 a 999999)
    const sixDigitNumber = (randomNumber % 900000) + 100000;
    return sixDigitNumber;
  }
}
