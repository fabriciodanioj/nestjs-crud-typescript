import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';

interface IUserQuery {
  active: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const usersCount = await this.usersModel.countDocuments();

    let user: User;

    if (usersCount === 0) {
      user = await this.usersModel.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: '123456',
        role: 'admin',
      });
    } else {
      user = await this.usersModel.create(createUserDto);
    }

    return user;
  }

  async findAll() {
    const pipeline = [];

    const $match: IUserQuery = {
      active: true,
    };

    pipeline.push({
      $match,
    });

    const users = await this.usersModel.aggregate(pipeline);

    const total = await this.usersModel.countDocuments();

    return {
      users,
      pagination: {
        total,
      },
    };
  }

  async findByEmail(email: string) {
    const user = await this.usersModel.findOne({ email: email });

    return user;
  }

  async findOne(id: string) {
    const user = await this.usersModel.findById(id);

    if (!user) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.usersModel.findById(id);

    if (!user) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    user = await this.usersModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    return user;
  }

  async remove(id: string) {
    const user = await this.usersModel.findById(id);

    if (!user) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    await this.usersModel.findByIdAndDelete(id);

    return;
  }
}
