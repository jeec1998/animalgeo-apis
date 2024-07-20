// src/user/dto/change-password.dto.ts
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}
