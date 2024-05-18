import { PartialType } from '@nestjs/swagger';
import { CreateResourceNameDto } from './create-resource-name.dto';

export class UpdateResourceNameDto extends PartialType(CreateResourceNameDto) {}
