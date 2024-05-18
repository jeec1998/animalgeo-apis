import { Test, TestingModule } from '@nestjs/testing';
import { ResourceNameController } from './resource-name.controller';
import { ResourceNameService } from './resource-name.service';

describe('ResourceNameController', () => {
  let controller: ResourceNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceNameController],
      providers: [ResourceNameService],
    }).compile();

    controller = module.get<ResourceNameController>(ResourceNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
