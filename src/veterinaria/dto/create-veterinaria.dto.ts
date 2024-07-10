import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsNumber, IsLatitude, IsLongitude, isNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { IsOptional, IsNumberString } from 'class-validator';

export class CreateVeterinariaDto {
  @ApiProperty({type: 'string'})
  @IsString()
  @IsNotEmpty()
  readonly imagVet:string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Certificado en PDF del título' })
  @IsNotEmpty()
  readonly certificatePdf: any; // Cambia el tipo según cómo manejes la subida de archivos

  @ApiProperty({ example: 'Veterinaria Los Pinos' })
  @IsString()
  @IsNotEmpty()
  readonly veterinaryName: string;

  @ApiProperty({ example: 'Veterinaria dedicada a la atención de mascotas pequeñas y grandes.' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: '12.345678' })
  @IsLatitude()
  @IsNotEmpty()
  readonly latitude: number;

  @ApiProperty({ example: '-76.543210' })
  @IsLongitude()
  @IsNotEmpty()
  readonly longitude: number;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  readonly veterinaryContactNumber: string;
}
