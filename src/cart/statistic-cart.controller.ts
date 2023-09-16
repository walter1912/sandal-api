import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { StatisticCartService } from './statistic-cart.service';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { Roles } from 'config/decorations/roles.decorator';
import { Role } from 'config/enums/role.enum';
import { CustomerCartGuard } from 'src/middlewares/guards/customer-cart.guard';
import { RolesGuard } from 'src/middlewares/guards/roles.guard';
@Controller('statistic/cart')
export class StatisticCartController {
  constructor(private readonly statisticCartService: StatisticCartService) {}
  @Get('sort')
  async statisticListSort(@Query('type') type: string, @Res() res: ResExpress) {
    const listSort = await this.statisticCartService.statisticListSort(type);
    let message = '';
    if (type === 'seller') {
      message = 'Danh sách sản phẩm đã bán chạy từ cao tới thấp';
    } else {
      message = 'Danh sách sản phẩm phổ biến từ cao tới thấp';
    }
    res.status(200).json({
      message,
      listIdProduct: listSort,
    });
  }

  @Get('admin/sort')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async statisticCustomerSort(
    @Query('type') type: string,
    @Res() res: ResExpress,
  ) {
    const listSort =
      await this.statisticCartService.statisticCustomerSort(type);
    let message = '';
    if (type === 'bought') {
      message = 'Thống kê khách hàng mua nhiều sản phẩm';
    } else {
      message = 'Thống kê khách hàng có nhiều sản phẩm trong giỏ hàng';
    }
    res.status(200).json({
      message,
      listIdProduct: listSort,
    });
  }
}
