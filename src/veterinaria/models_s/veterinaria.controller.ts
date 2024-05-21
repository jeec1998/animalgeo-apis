import { Controller, Get } from '@nestjs/common';
import { VeterinariaService } from './veterinaria.service';


@Controller('users')
export class VeterinariaController {
  constructor(private readonly veterinariaService: VeterinariaService) {}

  @Get()
  findAll() {
    return this.veterinariaService.findAll();
  }
}
