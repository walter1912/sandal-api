import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNumber()
  stock: number;

  @IsNumber()
  cost: number;

  @IsString()
  coupon: string;

  @IsNumber()
  star: number;

  @IsNumber()
  bought: number;

  @IsString()
  img: string;
}
