import { Module, forwardRef } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schema/bill.schema';
import { CartModule } from 'src/cart/cart.module';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [
    CustomersModule,
    forwardRef(() => CartModule),
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
  ],
  providers: [BillsService],
  controllers: [BillsController],
})
export class BillsModule {}
