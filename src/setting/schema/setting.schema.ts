import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;
@Schema({
    timestamps: true
})
export class Setting {
  @Prop({ required: true })
  idCustomer: string;
  @Prop({
    type: String,
    enum: ['gold', 'silver', 'bronze', 'newbie'],
  })
  type: string;
  @Prop()
  coupons: string;
  @Prop()
  note: string;
  @Prop()
  setting: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
