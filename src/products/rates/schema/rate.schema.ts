import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { CustomerSchema } from 'src/customers/schema/customer.schema';
import { ProductSchema } from 'src/products/schema/product.schema';

export type RateDocument = HydratedDocument<Rate>;

@Schema({
  timestamps: true,
})

export class Rate {
  @Prop({ required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idCustomer: string;
  @Prop({ required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idProduct: string;
  @Prop({ required: true })
  star: number;
}
export const RateSchema = SchemaFactory.createForClass(Rate);
