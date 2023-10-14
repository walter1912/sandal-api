import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from './product.schema';

export type ProductNameDocument = HydratedDocument<ProductName>;

@Schema({
  timestamps: true,
})
export class ProductName {
  @Prop()
  name: string;
  @Prop()
  code: string;
  @Prop()
  detail: string;

  @Prop({
    type: String,
    enum: ['tong', '2 quai', '3 quai'],
  })
  style: string;
  @Prop()
  color: string;

  @Prop()
  cost: number;

  @Prop()
  coupon: string;
  
  @Prop()
  star: number;
  listProduct?: Product[];
  bought: number;
  img?:string;
  _id?:string;
}

export const ProductNameSchema = SchemaFactory.createForClass(ProductName);
