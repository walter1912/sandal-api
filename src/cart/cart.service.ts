import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { CreateProductCartDto } from './dto/create-productCart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCart } from './schema/product-cart.shema';
import { Model, isValidObjectId } from 'mongoose';
import { UpdateProductCartDto } from './dto/update-productCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(ProductCart.name) private cartModel: Model<ProductCart>,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  async getCustomerCart(idCustomer: string): Promise<ProductCart[]> {
    await this.customersService.findById(idCustomer);
    return await this.cartModel.find({ idCustomer });
  }
  async create(
    createProductCartDto: CreateProductCartDto,
  ): Promise<ProductCart> {
    const { idCustomer, idProduct, quantity } = createProductCartDto;
    await this.customersService.findById(idCustomer);
    const product = await this.productsService.findById(idProduct);
    if (product.stock < quantity) {
      throw new BadRequestException('Vượt quá số lượng của kho');
    }
    let total = quantity * product.cost;
    createProductCartDto.price = total;
    const productCart = await new this.cartModel(createProductCartDto).save();
    return productCart;
  }

  async findById(id: string): Promise<ProductCart> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'Bạn nhập sai id sản phẩm ở trong giỏ hàng',
      );
    }
    const productCart = await this.cartModel.findById(id);
    if (!productCart) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    }
    return productCart;
  }

  async updateItemCart(
    id,
    updateProductCartDto: UpdateProductCartDto,
  ): Promise<ProductCart> {
    const existed = await this.findById(id);
    const update = {
      existed,
      ...updateProductCartDto,
      idCustomer: existed.idCustomer,
      idProduct: existed.idProduct,
    };
    return await this.cartModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    await this.findById(id);
    return await this.cartModel.findByIdAndDelete(id);
  }

}
