import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schema/customer.schema';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class StatsticCustomersService {
  constructor(
    @InjectModel(Customer.name) private customersModel: Model<Customer>,
  ) {}

  async getAllIdCustomer(): Promise<ObjectId[]> {
    return (await this.customersModel.find()).map((cus) => cus.id);
  }
}
