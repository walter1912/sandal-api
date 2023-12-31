import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, ObjectId } from 'mongoose';

export type ReviewDocument = HydratedDocument<ProductCart>;

@Schema({
  timestamps: true,
})
export class ProductCart {
  @Prop({ required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idCustomer: string;
  @Prop({ required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idProduct: string;
  @Prop({ required: true })
  quantity: number;
  @Prop()
  coupon: string;
  @Prop({ required: true })
  price: number;
  @Prop()
  size: number;
  @Prop()
  type: string;
  @Prop()
  idBill: string;

  @Prop()
  isBought: boolean;
  messageCoupon?: string;
  couponUsed?: string[];
  id:string;
}
export const ProductCartSchema = SchemaFactory.createForClass(ProductCart);
