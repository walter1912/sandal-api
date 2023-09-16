import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SettingService } from './setting.service';

import { Query as QueryExpress } from 'express-serve-static-core';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { Roles } from 'config/decorations/roles.decorator';
import { Role } from 'config/enums/role.enum';
import { RolesGuard } from 'src/middlewares/guards/roles.guard';

@Roles(Role.Admin)
@UseGuards(RolesGuard)
@Controller('admin/setting')
export class AdminSettingController {
  constructor(private readonly settingService: SettingService) {}
  @Post('createAllCustomer')
  async setTypeAndCouponAllCustomer(@Res() res: ResExpress) {
    await this.settingService.setTypeAndCouponAllCustomer();
    res.status(200).json({
      message:
        'bạn đã chỉnh sửa toàn bộ customer, bạn đã set loại khách hàng tự động thêm mã giảm giá vào cho họ, CẢNH BÁO: HÀNH ĐỘNG NÀY CHỈ NÊN LÀM 1 LẦN VÌ NÓ ẢNH HƯỞNG TỚI TẤT CẢ KHÁCH HÀNG',
    });
  }

  @Post(':idCustomer/addCoupons')
  async addCouponforOneCustomer(
    @Param() params,
    @Body('codeCoupons') codeCoupons: string[],
    @Res() res: ResExpress,
  ) {
    const { idCustomer } = params;
    const setting = await this.settingService.addCouponforOneCustomer(
      idCustomer,
      codeCoupons,
    );
    res.status(200).json({
      message: 'Thêm coupon cho customer thành công',
      setting: setting,
    });
  }
}
