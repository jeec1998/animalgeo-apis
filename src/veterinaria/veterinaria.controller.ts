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
import { extname } from 'path';
import { RateType } from './models/veterinaria.model';

@Controller('veterinaria')
export class VeterinariaController {
  constructor(private readonly veterinariaService: VeterinariaService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Invalid file type, only JPG, JPEG, PNG and PDF is allowed!',
            ),
            false,
          );
        }
      },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createVeterinariaDto: CreateVeterinariaDto,
    @Req() req,
  ) {
    const userId = req.user._id;
    console.log(files);
    const imagVetFile = files.find((file) => file.originalname === 'vetImg');
    const certificatePdfFile = files.find(
      (file) => file.originalname === 'certificateImage',
    );

    const imagVetBase64 = imagVetFile
      ? imagVetFile.buffer.toString('base64')
      : '';
    const certificatePdfBase64 = certificatePdfFile
      ? certificatePdfFile.buffer.toString('base64')
      : '';

    const createVeterinariaData = {
      ...createVeterinariaDto,
      imagVet: `data:${imagVetFile.mimetype};base64,${imagVetBase64}`,
      certificatePdf: `data:${certificatePdfFile.mimetype};base64,${certificatePdfBase64}`,
      userId,
    };
    return this.veterinariaService.create(createVeterinariaData, userId);
  }
  
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('top-rated')
  async getTopRated() {
    return this.veterinariaService.getTopRated();
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
  @Get('top-vets')
  async getTopVeterinarias() {
    return await this.veterinariaService.getTopVeterinarias();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('verify/:vetId')
  verify(@Param('vetId') vetId: string) {
    return this.veterinariaService.verify(vetId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('rate/:vetId')
  verrateify(@Param('vetId') vetId: string, @Body() rate: RateType) {
    return this.veterinariaService.rate(vetId, rate);
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
