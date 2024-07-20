import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  @Get('send-code')
  async sendCode(@Req() req, @Res() res) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
      await this.twoFactorAuthenticationService.sendCodeToUser(user);
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('Error generating 2FA:', error);
      return res.status(500).json({ message: 'Error generating 2FA' });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('verify')
  async verifyCode(@Req() req, @Body() body, @Res() res) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { code } = body;

    const isValidToken =
      await this.twoFactorAuthenticationService.validateTwoFactorAuthenticationToken(
        code,
        user.twoFactorAuthenticationSecret,
      );

    if (!isValidToken) {
      return res.status(401).json({ success: false });
    }

    return res.status(200).json({ success: true });
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

    const { code } = body;

    const isValidToken =
      await this.twoFactorAuthenticationService.validateTwoFactorAuthenticationToken(
        code,
        user.twoFactorAuthenticationSecret,
      );

    if (!isValidToken) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    await this.userService.enable2FA(user._id.toString());

    return res.status(200).json({ message: '2FA enabled successfully' });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('disable')
  async disableTwoFactorAuth(@Req() req, @Body() body, @Res() res) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!user.isTwoFactorAuthenticationEnabled) {
      return res.status(400).json({ message: '2FA already disabled!' });
    }

    const { code } = body;

    const isValidToken =
      await this.twoFactorAuthenticationService.validateTwoFactorAuthenticationToken(
        code,
        user.twoFactorAuthenticationSecret,
      );

    if (!isValidToken) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    await this.userService.disable2FA(user._id.toString());

    return res.status(200).json({ message: '2FA disabled successfully' });
  }
}
