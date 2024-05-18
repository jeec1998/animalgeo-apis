import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsEmail, IsBoolean} from 'class-validator';

export class CreateUser {
  @ApiProperty({example: 'John'})
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({example: 'Doe'})
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({example: 'john@mail.com'})
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({example: '1234567890'})
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @ApiProperty({example: true})
  @IsNotEmpty()
  @IsBoolean()
  readonly acceptContact: boolean;

  @ApiProperty({example: true})
  @IsNotEmpty()
  @IsBoolean()
  readonly acceptTerms: boolean;

  @ApiProperty({example: '123456'})
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({example: '123455dfgdfgdf6'})
  token: string;
}