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
import { isString } from 'class-validator';
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

  // phần xử lý của admin

  // phần cài đặt: post, put
  async setTypeAndCouponAllCustomer() {
    const listIdCustomer = await this.statsticCustomers.getAllIdCustomer();
    listIdCustomer.forEach(async (idCustomer) => {
      const existed = await this.settingModel.findOne({ idCustomer });
      if (!existed) {
        const total =
          await this.statisticBillService.getAllTotalPayByIdCustomer(
            idCustomer,
          );
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
  async addCouponforOneCustomer(idCustomer: string, codes: string[]) {
    let existed = await this.findByIdCustomer(idCustomer);
    if (!isString(existed.coupons)) {
      existed.coupons = '';
    }
    codes.forEach((code) => (existed.coupons += ',' + code.trim()));

    console.log('existed.coupons: ', existed.coupons);

    const updated = await this.settingModel.findOneAndUpdate(
      { idCustomer },
      existed,
      { new: true },
    );
    return updated;
  }
  // admin tìm kiếm thông tin
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

  // phần thuộc quyền của customer
  async getSettingCustomer(idCustomer: string) {
    let setting = await this.findByIdCustomer(idCustomer);
    let { coupons } = setting;
    const listCoupon = await this.getAllCouponOfCustomer(coupons);
    setting.listCoupon = listCoupon;
    console.log("setting: ", setting);

    return setting;
    
  }
  async getAllCouponOfCustomer(coupons: string) {
   
    let listCoupon = coupons.split(',');
    
   return await this.getCouponsFromList(listCoupon);
  }
  
  private  async getCouponsFromList(listCoupon) {
    var resultCoupon = [];
    for(let i = 0 ; i < listCoupon.length; i++) {
      let code = listCoupon[i].trim();
      const coupon = await this.couponsService.findOneByCode(code);
      if (isString(coupon.code)) {
       resultCoupon.push(coupon);
      }
    }
    return resultCoupon;
  }
}
