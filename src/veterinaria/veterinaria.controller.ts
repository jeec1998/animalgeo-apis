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
  Query,
  ParseFloatPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VeterinariaService } from './veterinaria.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('veterinaria')
export class VeterinariaController {
  constructor(private readonly veterinariaService: VeterinariaService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(FilesInterceptor('files', 2, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type, only JPG, JPEG, PNG and PDF is allowed!'), false);
      }
    },
  }))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createVeterinariaDto: CreateVeterinariaDto,
    @Req() req,
  ) {
    const userId = req.user._id;
    const host = req.get('host');
    const protocol = req.protocol;
    
    const imagVetFile = files.find(file => file.mimetype.includes('image'));
    const certificatePdfFile = files.find(file => file.mimetype.includes('pdf'));

    const imagVet = imagVetFile ? `${protocol}://${host}/uploads/${imagVetFile.filename}` : '';
    const certificatePdf = certificatePdfFile ? `${protocol}://${host}/uploads/${certificatePdfFile.filename}` : '';
    
    const createVeterinariaData = {
      ...createVeterinariaDto,
      imagVet,
      certificatePdf,
      userId,
    };
    return this.veterinariaService.create(createVeterinariaData, userId);
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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('nearest')
  async findNearest(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    const nearestVeterinaries =
      await this.veterinariaService.findNearestVeterinaries(
        latitude,
        longitude,
      );
    return nearestVeterinaries;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veterinariaService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('verify/:id')
  verify(@Param('id') id: string) {
    return this.veterinariaService.verify(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVeterinariaDto: UpdateVeterinariaDto,
  ) {
    return this.veterinariaService.update(id, updateVeterinariaDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veterinariaService.remove(id);
  }
}
