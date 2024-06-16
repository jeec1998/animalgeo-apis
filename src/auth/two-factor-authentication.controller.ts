/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/models/user.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('generate')
  async generateTwoFactorAuth(@Req() req, @Res() res) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (user.isTwoFactorAuthenticationEnabled) {
      return res.status(400).json({ message: '2FA already enabled!' });
    }

    const secret =
      this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user.email,
      );

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret,
      label: `AnimalGeo:${user.email}`,
      issuer: 'AnimalGeo',
    });

    try {
      const qrCodeDataURL = await QRCode.toDataURL(otpAuthUrl);
      await this.userService.update2FASecret(user._id.toString(), secret);
      return res.status(200).json({ qrCode: qrCodeDataURL });
    } catch (error) {
      console.error('Error generating QR code:', error);
      return res.status(500).json({ message: 'Error generating QR code' });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('enable')
  async enableTwoFactorAuth(@Req() req, @Body() body, @Res() res) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (user.isTwoFactorAuthenticationEnabled) {
      return res.status(400).json({ message: '2FA already enabled!' });
    }

    const { token } = body;

    const isValidToken =
      this.twoFactorAuthenticationService.validateTwoFactorAuthenticationToken(
        token,
        user.twoFactorAuthenticationSecret,
      );

    if (!isValidToken) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    return res.status(200).json({ message: '2FA enabled successfully' });
  }
}
