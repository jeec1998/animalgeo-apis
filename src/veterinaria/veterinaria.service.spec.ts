import { Test, TestingModule } from '@nestjs/testing';
import { VeterinariaService } from './veterinaria.service';

describe('VeterinariaService', () => {
  let service: VeterinariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeterinariaService],
    }).compile();

    service = module.get<VeterinariaService>(VeterinariaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
