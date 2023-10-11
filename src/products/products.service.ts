import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Query as QueryExpress } from 'express-serve-static-core';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductName } from './schema/product-name.schema';
import { ProductNameDto } from './dto/product-name.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductName.name) private productNameModel: Model<ProductName>,
  ) {}

  async createProductName(createProductName: any): Promise<ProductName> {
    let { name, code } = createProductName;
    let existedName = await this.productNameModel
      .findOne({ name: name })
      .exec();
    if (existedName) {
      throw new BadRequestException('Đã tồn tại sản phẩm có tên như trên');
    }
    let existedCode = await this.productNameModel
      .findOne({ code: code })
      .exec();
    if (existedCode) {
      throw new BadRequestException('Đã tồn tại sản phẩm có code như trên');
    }
    return new this.productNameModel(createProductName).save();
  }

  async findAllProductName(): Promise<ProductNameDto[]> {
    let listProductName = await this.productNameModel.find().exec();
    let result = [];
    for (let i = 0; i < listProductName.length; i++) {
      const products = await this.searchAllByName(listProductName[i].name);
      let bought = products.reduce((totalBought, product, index) => {
        totalBought += product.bought;
        return totalBought;
      }, 0);
      const { star = 1, img = "", cost = 0, name ="" } = products[0];
      let newProduct: ProductNameDto = {
        listProduct: products,
        bought,
        ...listProductName[i],
        star,
        img,
        cost,
        name
      };
      result.push(newProduct);

    }

    return result;
  }
  async create(createProductDto: CreateProductDto): Promise<Product> {
    console.log('This action adds a new customer');
    return await new this.productModel(createProductDto).save();
  }

  async findAndSearchByNamePaginate(query: QueryExpress): Promise<Product[]> {
    console.log(`This action returns customers`);
    // tìm kiếm
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    // phân trang
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    if (query.page) {
      return this.productModel
        .find(keyword)
        .limit(resPerPage)
        .skip(skip)
        .exec();
    }
    return this.productModel.find(keyword).exec();
  }
  // element: {
  //   sole: { color: string; material: string };
  //   sandal: { color: string; material: string };
  // };
  async searchByElementPaginate(query: QueryExpress): Promise<Product[]> {
    const conditions = {} as any;

    if (query.element === 'sole') {
      if (query.color) {
        conditions['element.sole.color'] = query.color; // Tìm kiếm theo màu sắc của sole
      }
      if (query.material) {
        conditions['element.sole.material'] = query.material; // Tìm kiếm theo chất liệu của sole
      }
    }
    if (query.element === 'sandal') {
      if (query.color) {
        conditions['element.sandal.color'] = query.color; // Tìm kiếm theo màu sắc của sandal
      }
      if (query.material) {
        conditions['element.sandal.material'] = query.material; // Tìm kiếm theo chất liệu của sandal
      }
    }

    // Tiến hành tìm kiếm
    // phân trang
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    if (query.page) {
      return this.productModel
        .find(conditions)
        .limit(resPerPage)
        .skip(skip)
        .exec();
    }
    return this.productModel.find(conditions).exec();
  }

  async findById(id: string): Promise<Product> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Vui lòng nhập đúng id!');
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Không tìm thấy product!');
    }
    return product;
  }

  async searchAllByName(name: string): Promise<Product[]> {
    const products = await this.productModel.find({
      name: {
        $regex: name,
        $options: 'i',
      },
    });
    if (!products) {
      throw new NotFoundException('Không tìm thấy products!');
    }
    return products;
  }

  async updateById(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existed: Product = await this.findById(id);
    const existedDto = existed;
    const product = {
      existedDto,
      ...updateProductDto,
      name: existedDto.name,
      element: existedDto.element,
      style: existedDto.style,
    };

    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Product> {
    const existed = await this.findById(id);
    return await this.productModel.findByIdAndDelete(id);
  }

  async updateStock(id: string, change: number) {
    let existed = await this.findById(id);
    if (existed.stock === 0) {
      throw new BadRequestException('Hết hàng');
    }
    existed.bought -= change;
    existed.stock += change;
    if (existed.stock < 0) {
      throw new BadRequestException(
        'Không có đủ hàng để bán, khách hàng vui lòng giảm số lượng',
      );
    }
    return await this.productModel.findByIdAndUpdate(id, existed, {
      new: true,
    });
  }
}
