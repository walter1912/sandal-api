import { Module, forwardRef } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { ProductsModule } from 'src/products/products.module';
import { StatsticCustomersService } from './statistic-customers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, StatsticCustomersService],
  exports: [CustomersService, StatsticCustomersService, CustomersModule],
})
export class CustomersModule {}
