import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const speakeasy = require('speakeasy');

@Injectable()
export class TwoFactorAuthenticationService {
  generateTwoFactorAuthenticationSecret(email) {
    const secret = speakeasy.generateSecret({
      name: `ByteScrum Custom App:${email}`,
    });
    return secret.base32;
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
      window: 1,
    });
  }
}
