import { Injectable } from '@nestjs/common';
import { CreateResourceNameDto } from './dto/create-resource-name.dto';
import { UpdateResourceNameDto } from './dto/update-resource-name.dto';

@Injectable()
export class ResourceNameService {
  create(createResourceNameDto: CreateResourceNameDto) {
    return 'This action adds a new resourceName';
  }

  findAll() {
    return `This action returns all resourceName`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resourceName`;
  }

  update(id: number, updateResourceNameDto: UpdateResourceNameDto) {
    return `This action updates a #${id} resourceName`;
  }

  remove(id: number) {
    return `This action removes a #${id} resourceName`;
  }
}
