import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { CustomerSchema } from 'src/customers/schema/customer.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({ required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idCustomer: string;
  @Prop({ required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idProduct: string;
  @Prop({ required: true })
  content: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
