import { IsDate, IsNumber, IsString } from 'class-validator';

export class CouponDto {
  @IsString()
  code: string;
  @IsString()
  name: string;
  @IsNumber()
  percent: number;
  @IsDate()
  start: Date;
  @IsDate()
  end: Date;
  countUsed: number;
}
