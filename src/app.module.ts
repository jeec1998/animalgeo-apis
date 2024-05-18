import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserController } from './models/user.controller';
import { UserService } from './models/user.service';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>(
        'MONGO_DB_CONNECTION',
        'mongodb://root:root@localhost:27017/nest?authSource=admin',
      ),
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forFeature([
    { name:User.name, schema:UserSchema },
  ]),

],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
