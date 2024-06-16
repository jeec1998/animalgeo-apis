import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUser {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'name@domain.com' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
