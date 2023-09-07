import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schema/customer.schema';
import { Model, isValidObjectId } from 'mongoose';
import { Query as QueryExpress } from 'express-serve-static-core';
@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
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

  async updateById(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const existed: Customer = await this.findById(id);
    const existedDto: CreateCustomerDto = existed;
    const customer = {
      existedDto,
      ...updateCustomerDto,
      username: existedDto.username,
      email: existedDto.email,
      phone: existedDto.phone,
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
}
