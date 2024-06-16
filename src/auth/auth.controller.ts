import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/models/user.service';
import { AuthService } from './auth.service';
import { Public } from 'src/shared/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUser } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @ApiTags('Auth')
  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    const data = await this.userService.create(payload);
    return { message: 'User created successfully', data };
  }

  @Public()
  @ApiTags('Auth')
  @Post('login')
  async login(@Body() payload: LoginUser) {
    const data = await this.authService.login(payload.email, payload.password);
    return { data };
  }
}
