import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RateType,
  Veterinaria,
  VeterinariaDocument,
} from './models/veterinaria.model';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VeterinariaService {
  constructor(
    @InjectModel(Veterinaria.name)
    private readonly veterinariaModel: Model<VeterinariaDocument>,
    private readonly userService: UserService,
  ) {}

  async create(CreateVeterinariaDto: CreateVeterinariaDto, userId: string) {
    const newVeterinary = CreateVeterinariaDto;
    const createVeterinaria = await this.veterinariaModel.create({
      ...newVeterinary,
      userId: new Types.ObjectId(userId),
      isVerified: false,
    });
    return createVeterinaria;
  }
  async update(id: string, UpdateVeterinariaDto: UpdateVeterinariaDto) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.veterinariaModel.findOne({ _id }).exec();
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

  async findUserVets(userId: string) {
    const oUserId = new Types.ObjectId(userId);
    const veterinarias = await this.veterinariaModel
      .find({ userId: oUserId })
      .exec();
    return veterinarias;
  }

  async findOne(id: string) {
    console.log(id);
    const veterinaria = await this.veterinariaModel.findById(id);
    if (!veterinaria) {
      throw new NotFoundException('Veterinary with ID ${id} not found');
    }
    return veterinaria;
  }

  async remove(id: string) {
    const deletedVeterinaria =
      await this.veterinariaModel.findByIdAndDelete(id);
    if (!deletedVeterinaria) {
      throw new NotFoundException('Veterinary with ID ${id} not found');
    }
    return deletedVeterinaria;
  }

  async verify(id: string) {
    const _id = new Types.ObjectId(id);
    const vet = await this.veterinariaModel.findOne({ _id }).exec();
    if (!vet) {
      throw new NotFoundException('Veterinaria with ID ${id} not found');
    }

    const updatedVet = await this.veterinariaModel
      .findByIdAndUpdate(
        _id,
        { isVerified: true },
        {
          new: true,
        },
      )
      .exec();

    await this.userService.makeVetAdmin(vet.userId.toString());

    return updatedVet;
  }

  async rate(id: string, newRate: RateType) {
    const _id = new Types.ObjectId(id);
    const vet = await this.veterinariaModel.findOne({ _id }).exec();
    if (!vet) {
      throw new NotFoundException(`Veterinaria with ID ${id} not found`);
    }

    const rateIndex = vet.rate.findIndex(
      (rate) => rate.userId === newRate.userId,
    );

    if (rateIndex !== -1) {
      vet.rate[rateIndex].score = newRate.score;
    } else {
      vet.rate.push(newRate);
    }

    const totalScore = vet.rate.reduce((sum, rate) => sum + rate.score, 0);
    vet.averageScore = totalScore / vet.rate.length;

    const updatedVet = await vet.save();

    return updatedVet;
  }

  async findNearestVeterinaries(
    latitude: number,
    longitude: number,
  ): Promise<Veterinaria[]> {
    const allVeterinaries = await this.veterinariaModel.find().exec();
    const veterinariesWithDistance = allVeterinaries.map((vet) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        vet.latitude,
        vet.longitude,
      );
      return { ...vet.toObject(), distance };
    });

    veterinariesWithDistance.sort((a, b) => a.distance - b.distance);
    const nearestVeterinaries = veterinariesWithDistance.slice(0, 5);

    return nearestVeterinaries;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
