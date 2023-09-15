import { Schema } from '@nestjs/mongoose';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';


export class SettingDto {
  @IsMongoId()
  idCustomer: string;
  @IsEnum(['gold', 'silver', 'bronze', 'newbie'])
  type: string;
  @IsString()
  coupons: string;
  note: string;
  setting: string;
}
