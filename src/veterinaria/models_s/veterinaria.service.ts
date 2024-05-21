import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Veterinaria, VeterinariaDocument } from './veterinaria.model';
import { CreateVeterinariaDto } from '../dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from '../dto/update-veterinaria.dto';


@Injectable()
export class VeterinariaService {
  constructor(
    @InjectModel(Veterinaria.name) private readonly veterinariaModel: Model<VeterinariaDocument>,
  ) {}

  async create(CreateVeterinariaDto: CreateVeterinariaDto) {
    const newVeterinary = CreateVeterinariaDto;
    newVeterinary.email = newVeterinary.email.toLowerCase();
    newVeterinary.password = await bcrypt.hash(newVeterinary.password, 10);
    const createVeterinaria = await this.veterinariaModel.create(newVeterinary);
    return createVeterinaria;
  }
  async update(id: string, UpdateVeterinariaDto: UpdateVeterinariaDto) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.veterinariaModel.findOne({ _id: id }).exec();
    if (!existingUser) {
      throw new NotFoundException('Veterinary with ID ${id} not found');
    }

    if (UpdateVeterinariaDto.email) {
      UpdateVeterinariaDto.email = UpdateVeterinariaDto.email.toLowerCase();
    }

    if (UpdateVeterinariaDto.password) {
      UpdateVeterinariaDto.password = await bcrypt.hash(UpdateVeterinariaDto.password, 10);
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
    const deletedVeterinaria = await this.veterinariaModel.findByIdAndDelete(id);
    if (!deletedVeterinaria) {
      throw new NotFoundException('Veterinary with ID ${id} not found');
    }
    return deletedVeterinaria;
  }
}
