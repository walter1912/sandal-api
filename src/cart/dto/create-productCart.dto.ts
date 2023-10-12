import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductCartDto {
  @IsNotEmpty()
  @IsMongoId()
  idCustomer: string;

  @IsNotEmpty()
  @IsMongoId()
  idProduct: string;

  @IsNumber()
  quantity: number;

  coupon: string;

  @IsNumber()
  price: number;

  isBought: boolean;

  idBill?: string;
}
