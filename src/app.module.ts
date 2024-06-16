// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Veterinaria } from './veterinaria/models_s/veterinaria.model';
import { VeterinariaModule } from './veterinaria/veterinaria.module';
import { TwilioModule } from './twilio/twilio.module';

@Module({
  imports: [
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
    UserModule,
    AuthModule,
    VeterinariaModule,
    TwilioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
