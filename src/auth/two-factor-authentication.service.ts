import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const speakeasy = require('speakeasy');

@Injectable()
export class TwoFactorAuthenticationService {
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

  validateTwoFactorAuthenticationToken(token, secret) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 6,
    });
  }
}
