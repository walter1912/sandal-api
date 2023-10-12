import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductCartDto {
  @IsNumber()
  quantity: number;

  coupon: string;

  @IsNumber()
  price: number;

  isBought: boolean;
  
  idBill?: string;
}
