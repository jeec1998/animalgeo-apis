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
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.create(CreateUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@Req() req) {
    const userId = req.user._id;
    const {
      _id,
      firstName,
      lastName,
      email,
      phoneNumber,
      isTwoFactorAuthenticationEnabled,
    } = await this.userService.findOne(userId);

    return {
      _id,
      firstName,
      lastName,
      email,
      phoneNumber,
      isTwoFactorAuthenticationEnabled,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user._id;
    return this.userService.update(userId, updateUserDto);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const { _id, firstName, lastName, email, phoneNumber } =
      await this.userService.findOne(userId);

    return {
      _id,
      firstName,
      lastName,
      email,
      phoneNumber,
    };
  }

  /*  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('password')
  async updatePassword(
    @Req() req,
    @Body() body: { password: string; newPassword: string },
  ) {
    const userId = req.user._id;
    return this.userService.updatePassword(
      userId,
      body.password,
      body.newPassword,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch()
  async update(@Req() req, @Body() UpdateUserDto: UpdateUserDto) {
    const userId = req.user._id;
    return this.userService.update(userId, UpdateUserDto);
  } */

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user._id;
    return this.userService.changePassword(userId, changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // Nuevo endpoint para obtener todos los usuarios
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }
}
