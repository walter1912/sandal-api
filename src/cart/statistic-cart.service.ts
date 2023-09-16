// public
// bán chạy
// -	thống kê sản phẩm bán chạy
// phổ biến
// -	thống kê sản phẩm có nhiều ở trong giỏ hàng

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCart } from './schema/product-cart.shema';
import { Model } from 'mongoose';
import { CartService } from './cart.service';
import { CartToBillService } from './cart-to-bill.service';
import { ProductsService } from 'src/products/products.service';
import { runInThisContext } from 'vm';

@Injectable()
export class StatisticCartService {
  constructor(
    @InjectModel(ProductCart.name) private cartModel: Model<ProductCart>,
    private readonly cartService: CartService,
    private readonly cartToBillService: CartToBillService,
  ) {}

  async getAllIdProductInAllCart(): Promise<string[]> {
    // các idProduct lặp lại thì dùng distinct là sẽ tạo mảng không lặp lại các phần tử
    return await this.cartModel.distinct('idProduct');
  }
  async countTotalProduct(
    idProduct: string,
    isBought: boolean,
  ): Promise<number> {
    const allProductBought = await this.cartModel.find({
      idProduct,
      isBought,
    });
    let total = 0;
    for (let i = 0; i < allProductBought.length; i++) {
      total += allProductBought[i].quantity;
    }
    return total;
  }

  async countPopularProduct(idProduct: string): Promise<number> {
    const allProduct = await this.cartService.findAllByIdProduct(idProduct);

    return allProduct.length;
  }
  async statisticListSort(type: string): Promise<Seller[]> {
    const allIdProduct = await this.getAllIdProductInAllCart();
    let listSeller: Seller[] = [];
    // có 2 loại: 'seller' hoặc là 'popular'
    const isBought = type === 'seller' ? true : false;
    for (let i = 0; i < allIdProduct.length; i++) {
      const idProduct = allIdProduct[i];
      const total = await this.countTotalProduct(idProduct, isBought);
      listSeller.push({
        idProduct,
        total,
      });
    }
    listSeller.sort((a, b) => b.total - a.total);
    return listSeller;
  }
  //  admin
  // thống kê khách hàng có nhiều sản phẩm trong giỏ hàng isBought = false type=bought
  // thống kê khách hàng mua nhiều sản phẩm : isBought = true type=cart
  //
  async statisticCustomerSort(type: string) {
    let isBought = type === 'bought' ? true : false;
    const listIdCustomer = await this.cartModel.distinct('idCustomer');
    let listSort: CustomerInCart[] = [];
    for (let i = 0; i < listIdCustomer.length; i++) {
      let idCustomer = listIdCustomer[i];
      let allProductCart = await this.cartModel.find({ idCustomer, isBought });
      listSort.push({
        idCustomer,
        total: allProductCart.length,
      });
    }
    listSort.sort((a, b) => b.total - a.total);
    return listSort;
  }
}

interface Seller {
  idProduct: string;
  total: number;
}
interface CustomerInCart {
  idCustomer: string;
  total: number;
}
