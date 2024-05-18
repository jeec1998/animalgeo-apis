import { Module } from '@nestjs/common';
import { ResourceNameService } from './resource-name.service';
import { ResourceNameController } from './resource-name.controller';

@Module({
  controllers: [ResourceNameController],
  providers: [ResourceNameService],
})
export class ResourceNameModule {}
