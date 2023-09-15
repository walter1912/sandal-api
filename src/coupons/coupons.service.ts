import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schema/coupon.schema';
import { Model, isValidObjectId, model } from 'mongoose';
import { CouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

//   conditions
  async getAll() {
    return await this.couponModel.find().exec();
  }
  async findOneByCode(code: string) {
    const existed = await this.couponModel.findOne({code})
    if(!existed) {
      return new Coupon();
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
}
