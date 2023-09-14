import {
  Body,
  Controller,
  Param,
  Post,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BillsService } from './bills.service';

import { Query as QueryExpress } from 'express-serve-static-core';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { PrepareBill } from './dto/prepare-bill.dto';
import { CustomerCartGuard } from 'src/middlewares/guards/customer-cart.guard';
import { Bill } from './schema/bill.schema';
import { SaveBill } from './dto/save-bill.dto';

@Controller('bills')
@UseGuards(CustomerCartGuard)
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

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
      bill: pendingBill,
    });
  }
  @Post('customers/:idCustomer/save/:idBill')
  async createSaveBill(@Body() body, @Param() params, @Res() res: ResExpress) {
    const { idBill } = params;
    const saveBill: SaveBill = body;
    const bill = await this.billsService.createSaveBill(idBill, saveBill);
    res.status(200).json({
        message: 'Tạo hóa đơn thành công',
        bill
      });
  }
}
