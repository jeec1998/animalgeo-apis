import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VeterinariaService } from './veterinaria.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('veterinaria')
export class VeterinariaController {
  constructor(private readonly veterinariaService: VeterinariaService) {}
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Req() req, @Body() createVeterinariaDto: CreateVeterinariaDto) {
    return this.veterinariaService.create(createVeterinariaDto, req.user._id);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.veterinariaService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('user/:userId')
  findUserVets(@Param('userId') userId: string) {
    return this.veterinariaService.findUserVets(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veterinariaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVeterinariaDto: UpdateVeterinariaDto,
  ) {
    return this.veterinariaService.update(id, updateVeterinariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veterinariaService.remove(id);
  }
}
