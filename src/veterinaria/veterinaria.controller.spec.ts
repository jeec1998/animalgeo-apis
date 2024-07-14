import { Test, TestingModule } from '@nestjs/testing';
import { VeterinariaController } from './veterinaria.controller';
import { VeterinariaService } from './veterinaria.service';

describe('VeterinariaController', () => {
  let controller: VeterinariaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeterinariaController],
      providers: [VeterinariaService],
    }).compile();

    controller = module.get<VeterinariaController>(VeterinariaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
