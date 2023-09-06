import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Vui lòng nhập đúng id!');
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy user!');
    }

    return user;
  }

  async updateById(id: string, user: User): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
