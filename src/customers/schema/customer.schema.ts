import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  timestamps: true
})
export class Customer {
  @Prop({ unique: [true, "Username của khách hàng đã tồn tại"] })
  username: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  dob: string;
  gender: string;
  type: number;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
