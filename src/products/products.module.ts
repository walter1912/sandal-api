import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews/reviews.service';
import { RatesService } from './rates/rates.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { Review, ReviewSchema } from './reviews/schema/review.schema';
import { Rate, RateSchema } from './rates/schema/rate.schema';
import { CustomersModule } from 'src/customers/customers.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { RolesGuard } from 'src/middlewares/guards/roles.guard';
import { ProductName, ProductNameSchema } from './schema/product-name.schema';

@Module({
  imports: [
    forwardRef(() => CustomersModule),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: Rate.name, schema: RateSchema }]),
    MongooseModule.forFeature([{name: ProductName.name, schema: ProductNameSchema}])
  ],
  controllers: [ProductsController],
  providers: [ReviewsService, RatesService, ProductsService],
  exports: [ReviewsService,ProductsService, ProductsModule],
})
export class ProductsModule {}
