import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { BillsModule } from 'src/bills/bills.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './schema/setting.schema';
import { CustomersModule } from 'src/customers/customers.module';
import { CouponsModule } from 'src/coupons/coupons.module';
import { CustomerSettingController } from './customer-setting.controller';
import { AdminSettingController } from './admin-setting.controller';

@Module({
  imports: [
    BillsModule,
    CustomersModule,
    CouponsModule,
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
  ],
  controllers: [AdminSettingController, CustomerSettingController],
  providers: [SettingService],
})
export class SettingModule {}
