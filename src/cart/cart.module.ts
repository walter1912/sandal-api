import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CustomersModule } from 'src/customers/customers.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductCart, ProductCartSchema } from './schema/product-cart.shema';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerCartGuard } from 'src/middlewares/guards/customer-cart.guard';
import { APP_GUARD } from '@nestjs/core';
import { BillsModule } from 'src/bills/bills.module';
import { CartToBillService } from './cart-to-bill.service';
import { CouponsModule } from 'src/coupons/coupons.module';
import { StatisticCartController } from './statistic-cart.controller';
import { StatisticCartService } from './statistic-cart.service';

@Module({
  imports: [
    CustomersModule,
    ProductsModule,
    CouponsModule,
    forwardRef(() => BillsModule),
    MongooseModule.forFeature([
      { name: ProductCart.name, schema: ProductCartSchema },
    ]),
  ],
  providers: [CartService, CartToBillService, StatisticCartService],
  controllers: [CartController, StatisticCartController],
  exports: [CartService, CartToBillService, CartModule],
})
export class CartModule {}
