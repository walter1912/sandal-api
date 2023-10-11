import { IsString, IsObject, IsEnum, IsNumber } from 'class-validator';
import { Sole } from './sole.dto';
import { Sandal } from './sandal.dto';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsObject()
  element: {
    sole: Sole;
    sandal: Sandal;
  };

  @IsEnum(['tong', '2 quai', '3 quai'])
  style: string;

  @IsNumber()
  stock: number;

  @IsNumber()
  cost: number;

  @IsString()
  coupon: string;

  @IsNumber()
  star: number;

  @IsNumber()
  bought?: number;

  @IsString()
  img: number;
}