import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCart } from './schema/product-cart.shema';
import { Model, isValidObjectId } from 'mongoose';
import { CartService } from './cart.service';
import { CouponsService } from 'src/coupons/coupons.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartToBillService {
  constructor(
    @InjectModel(ProductCart.name) private cartModel: Model<ProductCart>,
    private readonly cartService: CartService,
    private readonly couponsService: CouponsService,
    private readonly productService: ProductsService,
  ) {}

  // các thao tác liên quan tới billModule
  async addProductCartToBill(idProductCart: string, idBill: string) {
    let existed = await this.cartService.findById(idProductCart);
    let updatePrice = await this.calculatingCoupon(existed);
    console.log('updatePrice: ', updatePrice);

    const productBill = {
      updatePrice,
      idBill: idBill,
    };
    let result = await this.cartModel.findByIdAndUpdate(
      idProductCart,
      productBill,
      {
        new: true,
      },
    );
    console.log("data productBill: ", productBill);

    console.log("existed productBill: ", existed);
    console.log("update productBill: ", result);
    
    
    result.messageCoupon = updatePrice.messageCoupon;
    result.couponUsed = updatePrice.couponUsed;
    return result;
  }

  async findProductBillByIdBill(idBill: string) : Promise<ProductCart[]> {
    if (!isValidObjectId(idBill)) {
      throw new BadRequestException('Bạn nhập sai id Bill!');
    }
    console.log("idBill: ", idBill);
    
    return await this.cartModel.find({ idBill :idBill  }).exec();
  }

  async updateProductBought(idProductCart: string) {
    let productBill = await this.cartModel.findById(idProductCart);
    let bought = {
      productBill,
      isBought: true,
    };

    const updated = await this.cartModel.findByIdAndUpdate(
      idProductCart,
      bought,
      {
        new: true,
      },
    );
    console.log('bought: ', bought);
    console.log('updated: ', updated);

    return updated;
  }

  private async calculatingCoupon(existed): Promise<ProductCart> {
    let productCart = existed;
    productCart.id = existed.id;
    let price = 0;
    let couponCodes = existed.coupon.split(',');
    console.log('couponCodes: ', couponCodes);

    productCart.messageCoupon = '';
    let maxDiscout = 0;
    let percent = 0;
    productCart.couponUsed = [];
    for (let i = 0; i < couponCodes.length; i++) {
      let code = couponCodes[i];
      if (code == '') continue;
      let coupon = await this.couponsService.findOneByCode(code);
      let today = new Date();
      if (
        coupon.start.getTime() < today.getTime() &&
        coupon.end.getTime() > today.getTime()
      ) {
        const { message = 'loading' } =
          await this.couponsService.addOneUsed(code);
        if (message === 'use') {
          if (coupon.maxDiscount > maxDiscout) {
            maxDiscout = coupon.maxDiscount;
          }
          if (coupon.percent > percent) {
            percent = coupon.percent;
          }
          productCart.couponUsed.push(code);
        } else {
          productCart.messageCoupon = message;
        }
      } else {
        productCart.messageCoupon = `Sản phẩm ${productCart.id} không sử dụng được mã ${code}`;
      }
    }
    let discount = Number((existed.price * percent) / 100);
    if (discount > maxDiscout) discount = maxDiscout;
    price = existed.price - discount;
    if (price <= 0) price = 0;
    productCart.price = price;
    return productCart;
  }

  async updateStockProductWhenSaveBill(idProductBill) {
    let productBill = await this.cartService.findById(idProductBill);
    let change: number = -productBill.quantity;
    let product = await this.productService.updateStock(
      productBill.idProduct,
      change,
    );
    console.log('product change: ', product, change);
  }
}
