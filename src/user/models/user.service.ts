import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = createUserDto;
    newUser.email = newUser.email.toLowerCase();
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const createdUser = await this.userModel.create(newUser);
    return createdUser;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.userModel.findOne({ _id: id }).exec();
    if (!existingUser) {
      throw new NotFoundException('User with ID ${id} not found');
    }

    if (updateUserDto.email) {
      updateUserDto.email = updateUserDto.email.toLowerCase();
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(_id, updateUserDto, {
        new: true,
      })
      .exec();

    return updatedUser;
  }

  async update2FASecret(id: string, secret: string) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.userModel.findOne({ _id: id }).exec();
    if (!existingUser) {
      throw new NotFoundException('User with ID ${id} not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        _id,
        { twoFactorAuthenticationSecret: secret },
        {
          new: true,
        },
      )
      .exec();

    return updatedUser;
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User with ID ${id} not found');
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User with ID ${id} not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('User with ID ${id} not found');
    }
    return deletedUser;
  }
}
