import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(CreateUserDto: CreateUserDto) {
    return 'This action adds a new resourceName';
  }

  findAll() {
    return `This action returns all resourceName`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resourceName`;
  }

  update(id: number, UpdateUserDto: UpdateUserDto) {
    return `This action updates a #${id} resourceName`;
  }

  remove(id: number) {
    return `This action removes a #${id} resourceName`;
  }
}
