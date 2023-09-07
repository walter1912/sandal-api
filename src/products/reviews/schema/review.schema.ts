import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { CustomerSchema } from 'src/customers/schema/customer.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({ type: { ref: CustomerSchema }, required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idCustomer: ObjectId;
  @Prop({ type: { ref: ProductSchema }, required: true }) // Định nghĩa kiểu dữ liệu là ObjectId
  idProduct: ObjectId;
  @Prop({ required: true })
  content: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
