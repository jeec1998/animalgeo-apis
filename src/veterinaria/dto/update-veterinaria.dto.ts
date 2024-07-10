import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsLatitude, IsLongitude } from 'class-validator';
import { CreateVeterinariaDto } from './create-veterinaria.dto';

export class UpdateVeterinariaDto extends PartialType(CreateVeterinariaDto) {

  @ApiProperty({type: 'string'})
  @IsString()
  @IsNotEmpty()
  readonly imagVet:string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Certificado en PDF del título', required: false })
  readonly certificatePdf?: any; // Cambia el tipo según cómo manejes la subida de archivos

  @ApiProperty({ example: 'Veterinaria Los Pinos', required: false })
  @IsString()
  readonly veterinaryName?: string;

  @ApiProperty({ example: 'Veterinaria dedicada a la atención de mascotas pequeñas y grandes.', required: false })
  @IsString()
  readonly description?: string;

  @ApiProperty({ example: '12.345678', required: false })
  @IsLatitude()
  readonly latitude?: number;

  @ApiProperty({ example: '-76.543210', required: false })
  @IsLongitude()
  readonly longitude?: number;

  @ApiProperty({ example: '9876543210', required: false })
  @IsString()
  readonly veterinaryContactNumber?: string;
}

