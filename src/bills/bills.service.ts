import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schema/bill.schema';
import { Model, isValidObjectId } from 'mongoose';
import { PrepareBill } from './dto/prepare-bill.dto';
import { CartToBillService } from 'src/cart/cart-to-bill.service';
import { ProductCart } from 'src/cart/schema/product-cart.shema';
import { SaveBill } from './dto/save-bill.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<Bill>,
    private cartToBillService: CartToBillService,
  ) {}

  async getInforBill(
    id: string,
  ): Promise<{ bill: Bill; listProductBill: ProductCart[] }> {
    const bill = await this.findById(id);
    let listProductBill =
      await this.cartToBillService.findProductBillByIdBill(id);

    return {
      bill,
      listProductBill,
    };
  }
  async findById(id: string): Promise<Bill> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Bạn nhập sai id bill');
    }
    const existed = await this.billModel.findById(id);
    if (!existed) {
      throw new NotFoundException('Không tìm thấy bill');
    }
    return existed;
  }
  async createPendingBill(prepareBill: PrepareBill) {
    const { productCarts, ...createBill } = prepareBill;
    let messageCoupons = [];
    let couponUsed = [];
    let statePay = 'empty';
    if (productCarts.length > 0) {
      statePay = 'pending';
    }
    const postBill = {
      ...createBill,
      statePay,
    };
    let bill = await new this.billModel(postBill).save();
    let total = 0;
    console.log('creat pending bill have idBill = ', bill.id);
    console.log('creat pending bill have bill = ', bill);

    if (productCarts.length > 0) {
      for (let i = 0; i < productCarts.length; i++) {
        let id = String(productCarts[i]);

        let productBill = await this.cartToBillService.addProductCartToBill(
          id,
          bill.id,
        );
        messageCoupons.push(productBill.messageCoupon);
        couponUsed = [...couponUsed, ...productBill.couponUsed];
        total = this.calculatingPriceProductCart(total, productBill);
      }
    }
    bill.total = total + bill.ship;
    let result = await this.billModel.findByIdAndUpdate(bill.id, bill, {
      new: true,
    });
    result.messageCoupons = messageCoupons;
    result.couponUsed = couponUsed;
    return result;
  }

  async createSaveBill(id: string) {
    let saveBill = await this.findById(id);

    saveBill.total = this.calculatingTotalCost(saveBill.total, saveBill);
    saveBill.statePay = 'shipping';
    const listProductBill =
      await this.cartToBillService.findProductBillByIdBill(id);
    console.log('listProductBill: ', listProductBill);

    for (let i = 0; i < listProductBill.length; i++) {
      let idProductBill = String(listProductBill[i].id);
      await this.cartToBillService.updateProductBought(idProductBill);
      await this.cartToBillService.updateStockProductWhenSaveBill(
        idProductBill,
      );
    }
    return await this.billModel.findByIdAndUpdate(id, saveBill, { new: true });
  }
  //   tính toán coupon , phí ship, ...
  // kiểm tra xem người dùng này được dùng coupon này hay không ,...
  private calculatingTotalCost(total: number, saveBill): number {
    total += Number(saveBill.ship);
    return total;
  }
  // chia hàm nhỏ ra để đến lúc có thêm coupon thì tính nó sẽ tiện hơn
  private calculatingPriceProductCart(
    total: number,
    productBill: ProductCart,
  ): number {
    total += Number(productBill.price);
    return total;
  }
}
