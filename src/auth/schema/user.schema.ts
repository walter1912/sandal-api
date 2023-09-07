import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'config/enums/role.enum';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true
})
export class User {
  @Prop({unique:[true, "username đã tồn tại"]})
  username: string;
  @Prop({required: true})
  password: string;
  @Prop()
  roles: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
