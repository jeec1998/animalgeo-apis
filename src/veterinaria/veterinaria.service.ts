import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Veterinaria, VeterinariaDocument } from './models/veterinaria.model';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';

@Injectable()
export class VeterinariaService {
  constructor(
    @InjectModel(Veterinaria.name)
    private readonly veterinariaModel: Model<VeterinariaDocument>,
  ) {}

  async create(CreateVeterinariaDto: CreateVeterinariaDto, userId: string) {
    const newVeterinary = CreateVeterinariaDto;
    const createVeterinaria = await this.veterinariaModel.create({
      ...newVeterinary,
      userId: new Types.ObjectId(userId),
    });
    return createVeterinaria;
  }
  async update(id: string, UpdateVeterinariaDto: UpdateVeterinariaDto) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.veterinariaModel
      .findOne({ _id: id })
      .exec();
    if (!existingUser) {
      throw new NotFoundException('Veterinary with ID ${id} not found');
    }

    const updateVeterinaria = await this.veterinariaModel
      .findByIdAndUpdate(_id, UpdateVeterinariaDto, {
        new: true,
      })
      .exec();

    return updateVeterinaria;
  }

  async findAll() {
    const veterinarias = await this.veterinariaModel.find().exec();
    return veterinarias;
  }

  async findOne(id: string) {
    const veterinaria = await this.veterinariaModel.findById(id);
    if (!veterinaria) {
      throw new NotFoundException('Veterinary with ID ${id} not found');
    }
    return Veterinaria;
  }

  async remove(id: string) {
    const deletedVeterinaria =
      await this.veterinariaModel.findByIdAndDelete(id);
    if (!deletedVeterinaria) {
      throw new NotFoundException('Veterinary with ID ${id} not found');
    }
    return deletedVeterinaria;
  }
}
