import { Controller, Get, Param, Res } from '@nestjs/common';
import { SettingService } from './setting.service';

import { Query as QueryExpress } from 'express-serve-static-core';

import { Request as ReqExpress, Response as ResExpress } from 'express';
@Controller('setting')
export class CustomerSettingController {
  constructor(private readonly settingService: SettingService) {}


  @Get('/:idCustomer')
  async getSettingCustomer(@Param() params, @Res() res: ResExpress) {
    const idCustomer = params.idCustomer;
    const settingCustomer =
      await this.settingService.getSettingCustomer(idCustomer);
    res.status(200).json({
      message: 'Lấy thành công danh sách mã giảm giá của khách hàng',
      settingCustomer,
    });
  }

}
