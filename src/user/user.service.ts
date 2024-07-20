import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User, UserDocument } from './models/user.model';

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
    const existingUser = await this.userModel.findOne({ _id }).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
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

  async updatePassword(id: string, password: string, newPassword: string) {
    const _id = new Types.ObjectId(id);
    const user = await this.userModel.findOne({ _id }).exec();
    if (!user) {
      throw new NotFoundException('User with ID ${id} not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const updatedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        _id,
        { password: updatedPassword },
        {
          new: true,
        },
      )
      .exec();

    return updatedUser;
  }

  async update2FASecret(id: string, secret: string) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.userModel.findOne({ _id }).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
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

  async enable2FA(id: string) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.userModel.findOne({ _id }).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        _id,
        { isTwoFactorAuthenticationEnabled: true },
        {
          new: true,
        },
      )
      .exec();

    return updatedUser;
  }

  async disable2FA(id: string) {
    const _id = new Types.ObjectId(id);
    const existingUser = await this.userModel.findOne({ _id }).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        _id,
        { isTwoFactorAuthenticationEnabled: false },
        {
          new: true,
        },
      )
      .exec();

    return updatedUser;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.findOne(id);
    const isMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;

    return user.save();
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
