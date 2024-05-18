import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceNameService } from './resource-name.service';
import { CreateResourceNameDto } from './dto/create-resource-name.dto';
import { UpdateResourceNameDto } from './dto/update-resource-name.dto';

@Controller('resource-name')
export class ResourceNameController {
  constructor(private readonly resourceNameService: ResourceNameService) {}

  @Post()
  create(@Body() createResourceNameDto: CreateResourceNameDto) {
    return this.resourceNameService.create(createResourceNameDto);
  }

  @Get()
  findAll() {
    return this.resourceNameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceNameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceNameDto: UpdateResourceNameDto) {
    return this.resourceNameService.update(+id, updateResourceNameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceNameService.remove(+id);
  }
}
