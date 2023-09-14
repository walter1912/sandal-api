import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Query as QueryExpress } from 'express-serve-static-core';

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { CreateProductCartDto } from './dto/create-productCart.dto';
import { UpdateProductCartDto } from './dto/update-productCart.dto';
import { CustomerCartGuard } from 'src/middlewares/guards/customer-cart.guard';

@Controller('cart')
@UseGuards(CustomerCartGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}
  // get 'cart/:idCustomer'
  // getCustomerCart
  @Get(':idCustomer')
  async getCustomerCart(@Param() params, @Res() res: ResExpress) {
    const { idCustomer } = params;
    const cart = await this.cartService.getCustomerCart(idCustomer);
    res.status(200).json({
      message: 'Lấy thành công danh sách trong giỏ hàng',
      cart,
    });
  }
  // post 'cart/:idCustomer'
  // addProductCart
  @Post(':idCustomer')
  async addProductCart(@Param() params, @Body() body, @Res() res: ResExpress) {
    const { idCustomer } = params;
    const createProductCartDto: CreateProductCartDto = {
      ...body,
      idCustomer: idCustomer,
      isBought: false,
    };
    const productCart = await this.cartService.create(createProductCartDto);
    res.status(201).json({
      message: 'Thêm vào giỏ hàng thành công',
      productCart,
    });
  }
  // get 'cart/:idItem'
  @Get('items/:idItem')
  async getById(@Param() params, @Res() res: ResExpress) {
    const { idItem } = params;
    const productCart = await this.cartService.findById(idItem);
    res.status(200).json({
      message: 'Lấy thông tin sản phẩm trong giỏ hàng thành công',
      productCart,
    });
  }
  // put 'cart/:idItem'
  @Put('items/:idItem')
  async updateItemCart(@Param() params, @Body() body, @Res() res: ResExpress) {
    const { idItem } = params;
    const updateProductCartDto: UpdateProductCartDto = { ...body };
    const productCart = await this.cartService.updateItemCart(
      idItem,
      updateProductCartDto,
    );
    res.status(200).json({
      message: 'Cập nhật giỏ hàng thành công',
      productCart,
    });
  }
  // delete 'cart/:idItem'
  @Delete('items/:idItem')
  async deleteItemCart(@Param() params, @Res() res: ResExpress) {
    const { idItem } = params;
    const productCart = await this.cartService.delete(idItem);
    res.status(200).json({
      message: 'Xóa sản phẩm trong giỏ hàng thành công',
      productCart,
    });
  }
}
