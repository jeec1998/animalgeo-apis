// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { VeterinariaModule } from './veterinaria/veterinaria.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { User, UserSchema } from './user/models/user.model';
import { TwoFactorAuthenticationModule } from './auth/two-factor-authentication.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_MODULE_SECRET', 'secret'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    VeterinariaModule,
    TwoFactorAuthenticationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, UserService, AuthService],
})
export class AppModule {}
