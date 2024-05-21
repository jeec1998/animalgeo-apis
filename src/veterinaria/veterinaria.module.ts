import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Veterinaria, VeterinariaSchema } from './models_s/veterinaria.model';
import { VeterinariaController } from './veterinaria.controller';
import { VeterinariaService } from './models_s/veterinaria.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Veterinaria.name,
        schema: VeterinariaSchema,
      },
    ]),
  ],
  controllers: [VeterinariaController],
  providers: [VeterinariaService],
})
export class VeterinariaModule {}
