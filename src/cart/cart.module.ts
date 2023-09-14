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

@Module({
  imports: [
    CustomersModule,
    ProductsModule,
    forwardRef(() => BillsModule),
    MongooseModule.forFeature([
      { name: ProductCart.name, schema: ProductCartSchema },
    ]),
  ],
  providers: [
    CartService
  ],
  controllers: [CartController],
  exports: [CartService, CartModule],
})
export class CartModule {}
