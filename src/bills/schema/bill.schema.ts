import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type ReviewDocument = HydratedDocument<Bill>;

@Schema({
  timestamps: true,
})
export class Bill {
  @Prop({ required: true })
  idCustomer: string;
  // tiền ship
  @Prop()
  ship: number;

  @Prop()
  coupon: string;
  // sau khi đã tính tổng đơn hàng + tiền ship + giảm giá
  @Prop()
  total: number;
  // địa chỉ nhận hàng
  @Prop()
  address: string;

  @Prop()
  note: string;

  //   đang chờ thanh toán: pending; bill rỗng: empty; đã thanh toán: shipping; đã nhận hàng: received
  @Prop({
    type: String,
    enum: ['pending', 'empty', 'shiping', 'received'],
  })
  @Prop()
  statePay: string;

  //   tiền mặt hoặc chuyển khoản qua đâu: ngân hàng, momo, ...
  @Prop()
  typePay: string;
}
export const BillSchema = SchemaFactory.createForClass(Bill);
