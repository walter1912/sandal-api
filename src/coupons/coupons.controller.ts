import { Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { RolesGuard } from 'src/middlewares/guards/roles.guard';
import { Roles } from 'config/decorations/roles.decorator';
import { Role } from 'config/enums/role.enum';

import { Query as QueryExpress } from 'express-serve-static-core';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { CouponDto } from './dto/coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}
 
  @Get()
  async getAll(@Res() res: ResExpress) {
    const coupons = await this.couponsService.getAll();
    res.status(200).json({
        message: 'Lấy tất cả mã giảm giá thành công',
        coupons,
      });
  }
  @Get('top') 
  async getTop(@Res() res: ResExpress) {
    const coupons = await this.couponsService.getTop();
    res.status(200).json({
      message: 'Lấy top mã giảm giá thành công',
      coupons,
    });
  }
  @Post('admin')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async create(@Body() body, @Res() res: ResExpress) {
    const createCouponDto: CouponDto = body;
    const coupon = await this.couponsService.create(createCouponDto);
    res.status(201).json({
      message: 'Tạo mã giảm giá thành công',
      coupon,
    });
  }
  @Put('admin/:idCoupon')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async update(@Param('idCoupon') id: string, @Body() body, @Res() res: ResExpress) {
    const updateCouponDto: CouponDto = body;
    const coupon =await  this.couponsService.update(id, updateCouponDto);
    res.status(201).json({
      message: 'Cập nhật mã giảm giá thành công',
      coupon,
    });
  }
}
