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
  idBill: string;

  @Prop()
  isBought: boolean;
}
export const ProductCartSchema = SchemaFactory.createForClass(ProductCart);
