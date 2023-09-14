import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schema/bill.schema';
import { Model, isValidObjectId } from 'mongoose';
import { PrepareBill } from './dto/prepare-bill.dto';
import { CartService } from 'src/cart/cart.service';
import { ProductCart } from 'src/cart/schema/product-cart.shema';
import { SaveBill } from './dto/save-bill.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<Bill>,
    private cartService: CartService,
  ) {}

  async findById(id: String): Promise<Bill> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Bạn nhập sai id bill');
    }
    const existed = await this.billModel.findById(id);
    if (!existed) {
      throw new NotFoundException('Không tìm thấy bill');
    }
    return existed;
  }
  async createPendingBill(prepareBill: PrepareBill): Promise<Bill> {
    const { productCarts, ...createBill } = prepareBill;
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
    if (productCarts.length > 0) {
      for (let i = 0; i < productCarts.length; i++) {
        let id = String(productCarts[i]);
        let productBill = await this.cartService.addProductCartToBill(
          id,
          bill.id,
        );
        total = this.calculatingPriceProductCart(total, productBill);
      }
    }
    bill.total = total;
    return await this.billModel.findByIdAndUpdate(bill.id, bill, { new: true });
  }

  async createSaveBill(id: string, preSaveBill: SaveBill) {
    const saveBill = await this.findById(id);
   
    saveBill.total = this.calculatingTotalCost(saveBill.total, saveBill);
    saveBill.statePay = 'shipping';
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
