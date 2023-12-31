import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schema/customer.schema';
import { Model, isValidObjectId } from 'mongoose';
import { Query as QueryExpress } from 'express-serve-static-core';
import * as bcrypt from 'bcrypt';
@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}
  async checkExistPhone(phone: string) {
    return await this.customerModel.findOne({ phone });
  }
  // CustomerRegisterDto
  async create(createCustomerDto): Promise<Customer> {
    console.log('This action adds a new customer');
    const existed = await this.customerModel.findOne({
      username: createCustomerDto.username,
    });
    if (existed) {
      throw new HttpException('Đã tồn tại người dùng!', HttpStatus.BAD_REQUEST);
    }
    return await new this.customerModel(createCustomerDto).save();
  }

  async findAll(query: QueryExpress): Promise<Customer[]> {
    console.log(`This action returns customers`);
    // tìm kiếm
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    // phân trang
    const resPerPage = 3;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    if (query.page) {
      return this.customerModel
        .find(keyword)
        .limit(resPerPage)
        .skip(skip)
        .exec();
    }
    return this.customerModel.find(keyword).exec();
  }

  async findById(id: string): Promise<Customer> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Vui lòng nhập đúng id!');
    }

    const customer = await this.customerModel.findById(id);

    if (!customer) {
      throw new NotFoundException('Không tìm thấy customer!');
    }

    return customer;
  }

  async findByUsername(username: string): Promise<Customer> {
    const customer = await this.customerModel.findOne({ username });
    if (!customer) {
      throw new NotFoundException('Không tìm thấy customer!');
    }
    return customer;
  }
  async changePassword(id: string, passwordHashed): Promise<Customer> {
    const existed: Customer = await this.findById(id);
    const customer = {
      existed,
      password: passwordHashed,
    };
    return await this.customerModel.findByIdAndUpdate(id, customer, {
      new: true,
      runValidators: true,
    });
  }
  async updateById(id: string, updateCustomerDto): Promise<Customer> {
    const existed: Customer = await this.findById(id);
    const customer = {
      existed,
      ...updateCustomerDto,
      username: existed.username,
      email: existed.email,
      phone: existed.phone,
    };

    return await this.customerModel.findByIdAndUpdate(id, customer, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Customer> {
    const existed = await this.findById(id);
    return await this.customerModel.findByIdAndDelete(id);
  }

  async updateRefreshToken(username: string, refresh_token: string) {
    // throw new Error('Method not implemented.');
    const updatedCustomer = await this.customerModel.findOneAndUpdate(
      { username },
      { $set: { refreshToken: refresh_token } },
      { new: true },
    );

    if (!updatedCustomer) {
      throw new Error(`Customer with username ${username} not found`);
    }

    return updatedCustomer;
  }
  // (arg0: { username: string; }, arg1: { refreshToken: null; }) {
  //   throw new Error('Method not implemented.');
  // }
  async removeRT(username) {
    return await this.customerModel.findOneAndUpdate(
      { username },
      { $set: { refreshToken: null } },
    );
  }

  async getUserByRefresh(username, refresh_token) {
    const user = await this.findByUsername(username);

    const is_equal = refresh_token === user.refreshToken;

    if (!is_equal) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
