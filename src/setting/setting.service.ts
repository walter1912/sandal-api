import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from './schema/setting.schema';
import { StatisticBillService } from 'src/bills/statistic-bills.service';
import { Model, ObjectId, isValidObjectId } from 'mongoose';
import { StatsticCustomersService } from 'src/customers/statistic-customers.service';
import { SettingDto } from './dtos/setting.dto';
import { CouponsService } from 'src/coupons/coupons.service';
import { Coupon } from 'src/coupons/schema/coupon.schema';
/*
-	0 là newbie 
-	Trên 0 tới 1 tr là bronze 
-	Từ 1tr tới 5tr là silver 
-	Trên 5tr là gold

*/
@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    private readonly statisticBillService: StatisticBillService,
    private readonly statsticCustomers: StatsticCustomersService,
    private readonly couponsService: CouponsService,
  ) {}

  async setTypeAndCouponAllCustomer() {
    const listIdCustomer = await this.statsticCustomers.getAllIdCustomer();
    listIdCustomer.forEach(async (idCustomer) => {
      const existed = await this.settingModel.findOne({ idCustomer });
      if (!existed) {
        const total =
          await this.statisticBillService.getAllTotalPayByIdCustomer(
            idCustomer,
          );
          console.log('total: ', total);
          
        let type = 'newbie';
        let coupon = '';
        if (total > 0) {
          type = 'bronze';
          coupon = 'BRONZE';
        }
        if (total >= 1000000) {
          type = 'silver';
          coupon = 'SILVER';
        }
        if (total >= 5000000) {
          type = 'gold';
          coupon = 'GOLD';
        }
        let newPreSetting = {
          idCustomer,
          type,
          coupons: coupon,
        };
        await new this.settingModel(newPreSetting).save();
      }
    });
  }

  async findByIdCustomer(idCustomer: string): Promise<Setting> {
    if (!isValidObjectId(idCustomer)) {
      throw new BadRequestException('id customer bi sai');
    }
    const setting = await this.settingModel.findOne({ idCustomer });
    if (!setting) {
      throw new NotFoundException('Không tìm thấy setting của customer');
    }
    return setting;
  }

  async getAllCouponOfCustomer(idCustomer: string): Promise<Coupon[]> {
    const setting = await this.findByIdCustomer(idCustomer);
    const { coupons } = setting;
    let listCoupon = coupons.split(',');
    let resultCoupon = [];
    listCoupon.forEach(async (item) => {
      let code = item.trim();
      const coupon = await this.couponsService.findOneByCode(code);
      if (coupon.code.trim() !== '') {
        resultCoupon.push(coupon);
      }
    });
    return resultCoupon;
  }
}
