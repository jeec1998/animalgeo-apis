import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Veterinaria, VeterinariaSchema } from './models/veterinaria.model';
import { VeterinariaController } from './veterinaria.controller';
import { VeterinariaService } from './veterinaria.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Veterinaria.name,
        schema: VeterinariaSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [VeterinariaController],
  providers: [VeterinariaService, JwtService, UserService],
})
export class VeterinariaModule {}
