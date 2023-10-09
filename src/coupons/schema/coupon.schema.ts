import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;
@Schema({
  timestamps: true,
})
export class Coupon {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  //   phần trăm giảm giá
  @Prop({ required: true })
  percent: number;
  //   giảm tối đa bao nhiêu tiền
  //  trường hợp muốn mã giảm giá giảm số tiền nhất định thì để mặc định percent = 100
  //  khi đó sẽ giảm số tiền tối đa là maxDiscount hoặc là max giá trị sản phẩm
  @Prop({ required: true })
  maxDiscount: number;
  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;
// số lượt sử dụng
  @Prop()
  countUsed: number;
  // số lượt sử dụng tối đa 
  @Prop()
  maxUse: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
