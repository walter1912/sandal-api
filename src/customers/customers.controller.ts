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
  UseGuards,
} from '@nestjs/common';
import { Query as QueryExpress } from 'express-serve-static-core';

import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { CustomerCreatedGuard } from 'src/middlewares/guards/customer-created.guard';
import { ReviewsService } from 'src/products/reviews/reviews.service';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly reviewsService: ReviewsService,
  ) {}

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
  // @UseGuards(CustomerCreatedGuard)
  @Get(':id')
  async findOne(@Param() params, @Res() res: ResExpress) {
    const { id } = params;
    const customer = await this.customersService.findById(id);
    res.status(200).json({
      message: 'Lấy thông tin customer thành công',
      customer,
    });
  }
  @Get('usernames/:username')
  async findByUsername(@Param() params, @Res() res: ResExpress) {
    const { username } = params;
    const customer = await this.customersService.findByUsername(username);
    res.status(200).json({
      message: 'Lấy thông tin customer thành công',
      customer,
    });
  }
  // @Roles( cùng là 1 user)
  @UseGuards(CustomerCreatedGuard)
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
  @UseGuards(CustomerCreatedGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: ResExpress) {
    const customer = await this.customersService.deleteById(id);
    res.status(200).json({
      message: 'Xóa customer thành công',
      customer,
    });
  }

  // thao tác với reviews

  @Get(':id/reviews')
  async getAllReviewsByCustomer(
    @Param('id') id: string,
    @Res() res: ResExpress,
  ) {
    const idCustomer = id;
    const reviews = await this.reviewsService.getReviewsByIdCustomer(idCustomer);
    res.status(200).json({
      message:'Lấy tất cả reviews của khách hàng thành công',
      reviews: reviews
    })
  }
}
