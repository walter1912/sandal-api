import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schema/coupon.schema';
import { Model, isValidObjectId, model } from 'mongoose';
import { CouponDto } from './dto/coupon.dto';
import { isNumber } from 'class-validator';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  //   conditions
  async getAll() {
    return await this.couponModel.find().exec();
  }
  async getTop() {
    return await this.couponModel.find().sort({countUsed: -1}).limit(10).exec();
  }
  async findOneByCode(code: string) {
    const existed = await this.couponModel.findOne({ code }).exec();
    if (!existed) {
      return await new Coupon();
      // throw new NotFoundException('Không tìm thấy mã giảm giá');
    }
    return existed;
  }

  async findById(id: string): Promise<Coupon> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Bạn nhập sai id mã giảm giá');
    }
    const existed = await this.couponModel.findById(id);
    if (!existed) {
      throw new NotFoundException('Mã giảm giá không tồn tại');
    }
    return existed;
  }
  async create(createCouponDto: CouponDto): Promise<Coupon> {
    const { code } = createCouponDto;
    const existed = await this.couponModel.findOne({ code });
    if (existed) {
      throw new BadRequestException('Đã tồn tại mã giảm giá');
    }
    const coupon = await new this.couponModel(createCouponDto).save();
    return coupon;
  }
  async update(id: string, updateCouponDto: CouponDto) {
    const existed = await this.findById(id);
    updateCouponDto.code = existed.code;
    return await this.couponModel.findByIdAndUpdate(id, updateCouponDto, {
      new: true,
    });
  }
  async delete(id: string) {
    await this.findById(id);
    return await this.couponModel.findByIdAndDelete(id);
  }

  // tăng thêm 1 lượt sử dụng khi coupon được tìm thấy ở trong 1 sản phẩm khi được thêm vào bill
  async addOneUsed(code) {
    let existed = await this.couponModel.findOne({ code });
    if (isNumber(existed.countUsed)) {
      if (existed.countUsed === existed.maxUse) {
        throw new BadRequestException('Đã hết lượt sử dụng mã giảm giá!');
      }
      existed.countUsed += 1;
    } else existed.countUsed = 1;
    const updated = await this.couponModel.findOneAndUpdate({ code }, existed, {
      new: true,
    });
  }
}
