import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schema/bill.schema';
import { Model, ObjectId, SortOrder } from 'mongoose';
import { BillsService } from './bills.service';
import { isNumber } from 'class-validator';

@Injectable()
export class StatisticBillService {
  constructor(
    @InjectModel(Bill.name) private billsModel: Model<Bill>,
    private readonly billsService: BillsService,
  ) {}
  // có sort theo thời gian hoặc theo giá trị hóa đơn.
  // 'time' hoặc 'total'
  async getAllBillByIdCustomer(idCustomer: ObjectId, typeSort: string) {
    let sortBy = {}; // Đối tượng dùng để xác định cách sắp xếp

    if (typeSort === 'time') {
      sortBy = { updateAt: 1 }; // Sắp xếp theo thời gian tăng dần
    } else if (typeSort === 'total') {
      sortBy = { total: 1 }; // Sắp xếp theo giá trị hóa đơn tăng dần
    }
    const listbill = await this.billsModel
      .find({ idCustomer })
      .sort(sortBy)
      .exec();
    return listbill;
  }

  async getAllTotalPayByIdCustomer(idCustomer: ObjectId) {
    const listBill = await this.billsModel.find({ idCustomer });
    let totalPay = 0;
    for (let i = 0; i < listBill.length; i++) {
      if (isNumber(listBill[i].total)) {
        totalPay += listBill[i].total;
      }
    }
    return totalPay;
  }
}
