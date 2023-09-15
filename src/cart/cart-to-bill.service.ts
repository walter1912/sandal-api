import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCart } from './schema/product-cart.shema';
import { Model, isValidObjectId } from 'mongoose';
import { CartService } from './cart.service';
import { CouponsService } from 'src/coupons/coupons.service';

@Injectable()
export class CartToBillService {
  constructor(
    @InjectModel(ProductCart.name) private cartModel: Model<ProductCart>,
    private readonly cartService: CartService,
    private readonly couponsService: CouponsService,
  ) {}

  // các thao tác liên quan tới billModule
  async addProductCartToBill(idProductCart: string, idBill: string) {
    let existed = await this.cartService.findById(idProductCart);
    let updatePrice = await this.calculatingCoupon(existed);
    const productBill = {
      updatePrice,
      idBill: idBill,
    };
    let result =  await this.cartModel.findByIdAndUpdate(idProductCart, productBill, {
      new: true,
    });
    result.messageCoupon = updatePrice.messageCoupon;

    return result;
  }

  async findProductBillByIdBill(idBill: string) {
    if (!isValidObjectId(idBill)) {
      throw new BadRequestException('Bạn nhập sai id Bill!');
    }
    return await this.cartModel.find({ idBill });
  }

  async updateProductBought(idProductCart: string) {
    const productBill = await this.cartModel.findById(idProductCart);
    const bought = {
      productBill,
      isBought: true,
    };
    return await this.cartModel.findByIdAndUpdate(idProductCart, bought, {
      new: true,
    });
  }

  private async calculatingCoupon(existed): Promise<ProductCart> {
    let productCart = existed;
    productCart.id = existed.id;
    let price = 0;
    let couponCodes = productCart.coupon.split(',');
    productCart.messageCoupon = '';
    let maxDiscout = 0;
    let percent = 0;
    for (let i = 0; i < couponCodes.length; i++) {
      let code = couponCodes[i];
      let coupon = await this.couponsService.findOneByCode(code);
      let today = new Date();
      if (
        coupon.start.getTime() < today.getTime() &&
        coupon.end.getTime() > today.getTime()
      ) {
        if (coupon.maxDiscount > maxDiscout) {
          maxDiscout = coupon.maxDiscount;
        }
        if (coupon.percent > percent) {
          percent = coupon.percent;
        }
      } else {
        productCart.messageCoupon = `Sản phẩm ${productCart.id} không sử dụng được mã ${code}`;
      }
    }
    let discount = (productCart.price * percent) / 100;
    if (discount > maxDiscout) discount = maxDiscout;
    price = productCart.price - discount;
    if (price <= 0) price = 0;
    productCart.price = price;
    return productCart;
  }
}
