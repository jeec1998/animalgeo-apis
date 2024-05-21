import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  readonly firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  readonly lastName?: string;

  @ApiProperty({ example: 'john@mail.com', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsString()
  readonly phoneNumber?: string;

  @ApiProperty({ example: '123456', required: false })
  @IsString()
  password: string;
}
