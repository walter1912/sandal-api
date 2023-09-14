import { IsEnum, IsMongoId, IsNumber } from "class-validator";

export class PrepareBill {
  @IsMongoId()
  idCustomer: string;
  @IsNumber()
  ship: number;
  coupon: string;
//   total: number;
  address: string;
  note: string;
  // statePay: string;
  typePay: string;
  productCarts: string[];
}
