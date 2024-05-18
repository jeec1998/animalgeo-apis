import { Test, TestingModule } from '@nestjs/testing';
import { ResourceNameService } from './resource-name.service';

describe('ResourceNameService', () => {
  let service: ResourceNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceNameService],
    }).compile();

    service = module.get<ResourceNameService>(ResourceNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
