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

import { Request as ReqExpress, Response as ResExpress } from 'express';
import { ProductsService } from './products.service';
import { Roles } from 'config/decorations/roles.decorator';
import { Role } from 'config/enums/role.enum';
import { Public } from 'config/decorations/public.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/middlewares/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: ResExpress,
  ): Promise<any> {
    console.log('createProductDto: ', createProductDto);
    const product = await this.productsService.create(createProductDto);
    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product,
    });
  }

  @Public()
  @Get()
  async findAndSearchByNamePaginate(@Query() query: QueryExpress, @Res() res: ResExpress) {
    const products = await this.productsService.findAndSearchByNamePaginate(query);
    let message = 'Lấy danh sách sản phẩm ';
    if(query.name) {
      message += 'theo tên ';
    }
    if (products.length > 0) {
      res.status(200).json({
        message: message + 'thành công',
        products,
      });
    } else {
      res.status(404).json({
        message: message + 'không thành công',
        products,
      });
    }
  }
  @Public()
  @Get('elements')
  async searchByElementPaginate(@Query()query: QueryExpress, @Res() res: ResExpress) {
    const products = await this.productsService.searchByElementPaginate(query);
    if (products.length > 0) {
      res.status(200).json({
        message: 'Tìm danh sách sản phẩm theo element thành công',
        products,
      });
    } else {
      res.status(404).json({
        message: 'Tìm danh sách sản phẩm theo element không thành công',
        products,
      });
    }
  }
  @Public()
  @Get(':id')
  async findById(@Param() params, @Res() res: ResExpress) {
    const { id } = params;
    const product = await this.productsService.findById(id);
    res.status(200).json({
      message: 'Lấy thông tin sản phẩm thành công',
      product,
    });
  }

  @Public()
  @Get('names/:name')
  async searchAllByName(@Param() params, @Res() res: ResExpress) {
    const { name } = params;
    const product = await this.productsService.searchAllByName(name);
    res.status(200).json({
      message: 'Lấy thông tin sản phẩm thành công',
      product,
    });
  }
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: ResExpress,
  ) {
    const product = await this.productsService.updateById(
      id,
      updateProductDto,
    );
    res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      product,
    });
  }
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string, @Res() res: ResExpress) {
    const product = await this.productsService.deleteById(id);
    res.status(200).json({
      message: 'Xóa sản phẩm thành công',
      product,
    });
  }
}
