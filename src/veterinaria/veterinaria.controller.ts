import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeterinariaService } from './models_s/veterinaria.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';

@Controller('veterinaria')
export class VeterinariaController {
  constructor(private readonly veterinariaService: VeterinariaService) {}

  @Post()
  create(@Body() createVeterinariaDto: CreateVeterinariaDto) {
    return this.veterinariaService.create(createVeterinariaDto);
  }

  @Get()
  findAll() {
    return this.veterinariaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veterinariaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVeterinariaDto: UpdateVeterinariaDto) {
    return this.veterinariaService.update(id, updateVeterinariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veterinariaService.remove(id);
  }
}
