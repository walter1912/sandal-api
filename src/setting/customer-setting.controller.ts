import { Controller, Get, Param, Res } from '@nestjs/common';
import { SettingService } from './setting.service';

import { Query as QueryExpress } from 'express-serve-static-core';

import { Request as ReqExpress, Response as ResExpress } from 'express';
@Controller('setting')
export class CustomerSettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('/:idCustomer/coupons')
  async getAllCouponOfCustomer(@Param() params, @Res() res: ResExpress) {
    const idCustomer = params.idCustomer;
    const listCoupon =
      await this.settingService.getAllCouponOfCustomer(idCustomer);
    res.status(200).json({
      message: 'Lấy thành công danh sách mã giảm giá của khách hàng',
      listCoupon,
    });
  }
}
