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
import { UserService } from './models/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.create(CreateUserDto);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async findOne(@Req() req) {
    const userId = req.user._id; 
    return this.userService.findOne(userId);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch()
  async update(@Req() req, @Body() UpdateUserDto: UpdateUserDto) {
    const userId = req.user._id; 
    return this.userService.update(userId, UpdateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
