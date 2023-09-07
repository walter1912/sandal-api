import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Customer } from 'src/customers/schema/customer.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  name: string;
  
  @Prop({
    type: Object,
    required: true,
    properties: {
      sole: {
        type: Object,
        properties: {
          color: { type: String },
          material: { type: String },
        },
      },
      sandal: {
        type: Object,
        properties: {
          color: { type: String },
          material: { type: String },
        },
      },
    },
  })
  element: {
    sole: { color: string; material: string };
    sandal: { color: string; material: string };
  };

  @Prop({
    type: String,
    enum: ['tong', '2 quai', '3 quai'],
  })
  style: string;

  @Prop()
  stock: number;

  @Prop()
  cost: number;

  @Prop()
  coupon: string;

  @Prop()
  star: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
