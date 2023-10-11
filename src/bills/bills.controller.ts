import {
  Body,
  Controller,
  Param,
  Post,
  Res,
  Request,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { BillsService } from './bills.service';

import { Query as QueryExpress } from 'express-serve-static-core';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { PrepareBill } from './dto/prepare-bill.dto';
import { CustomerBillGuard } from 'src/middlewares/guards/customer-bill.guard';
import { StatisticBillService } from './statistic-bills.service';

@Controller('bills')
@UseGuards(CustomerBillGuard)
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private readonly statisticBillService: StatisticBillService,
  ) {}

  @Post('customers/:idCustomer')
  async createPendingBill(
    @Request() req,
    // @Param() params,
    @Body() body,
    @Res() res: ResExpress,
  ) {
    const idCustomer = req.user.id;
    const prepareBill: PrepareBill = {
      ...body,
      idCustomer,
    };
    const pendingBill = await this.billsService.createPendingBill(prepareBill);
    res.status(200).json({
      message: 'Tạo hóa đơn vào hàng đợi thành công',
      messageCoupons: pendingBill.messageCoupons,
      couponUsed: pendingBill.couponUsed,
      bill: pendingBill,
    });
  }
  @Post('customers/:idCustomer/save/:idBill')
  async createSaveBill(@Param() params, @Res() res: ResExpress) {
    const { idBill } = params;
    const bill = await this.billsService.createSaveBill(idBill);
    res.status(200).json({
      message: 'Tạo hóa đơn thành công',
      bill,
    });
  }

  @Get('customers/:idCustomer')
  async getAllBillByIdCustomer(
    @Param('idCustomer') idCustomer: string,
    @Query('typeSort') typeSort: string,
    @Res() res: ResExpress,
  ) {
    const bills = await this.statisticBillService.getAllBillByIdCustomer(
      idCustomer,
      typeSort,
    );
    res.status(200).json({
      message: 'Lấy danh sách bill thành công',
      bills,
    });
  }
  @Get('/:idBill')
  async getOneBill(@Param('idBill') idBill: string, @Res() res: ResExpress) {
    const bill = await this.billsService.findById(idBill);
    res.status(200).json({
      message: 'Lấy thông tin bill thành công',
      bill,
    });
  }
}
