import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/models/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/models/user.model';
import { TwilioService } from 'src/twilio/twilio.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TwoFactorAuthenticationController],
  providers: [
    TwoFactorAuthenticationService,
    JwtService,
    UserService,
    TwilioService,
  ],
})
export class TwoFactorAuthenticationModule {}
