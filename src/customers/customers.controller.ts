import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
  Put,
} from '@nestjs/common';
import { Query as QueryExpress } from 'express-serve-static-core';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './schema/customer.schema';
import { Public } from 'config/decorations/public.decorator';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { Roles } from 'config/decorations/roles.decorator';
import { Role } from 'config/enums/role.enum';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // @Public()
  // @Post()
  // async create(
  //   @Body() createCustomerDto: CreateCustomerDto,
  //   @Res() res: ResExpress,
  // ): Promise<any> {
  //   console.log('createCustomerDto: ', createCustomerDto);
  //   const customer = await this.customersService.create(createCustomerDto);
  //   res.status(201).json({
  //     message: 'Tạo khách hàng thành công',
  //     customer,
  //   });
  // }

  // @Roles(Role.Admin)
  @Get()
  async findAll(@Query() query: QueryExpress, @Res() res: ResExpress) {
    const customers = await this.customersService.findAll(query);
    if (customers.length > 0) {
      res.status(200).json({
        message: 'Lấy danh sách khách hàng thành công',
        customers,
      });
    } else {
      res.status(404).json({
        message: 'Lấy danh sách khách hàng không thành công',
        customers,
      });
    }
  }
  // @Roles(Role.Admin or cùng là 1 user)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: ResExpress) {
    const customer = await this.customersService.findById(id);
    res.status(200).json({
      message: 'Lấy thông tin customer thành công',
      customer,
    });
  }
  // @Roles( cùng là 1 user)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Res() res: ResExpress,
  ) {
    const customer = await this.customersService.updateById(
      id,
      updateCustomerDto,
    );
    res.status(200).json({
      message: 'Cập nhật customer thành công',
      customer,
    });
  }
  // @Roles( cùng là 1 user)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: ResExpress) {
    const customer = await this.customersService.deleteById(id);
    res.status(200).json({
      message: 'Xóa customer thành công',
      customer,
    });
  }
}
