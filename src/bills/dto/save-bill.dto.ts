import { IsEnum } from "class-validator";

export class SaveBill {
  idCustomer: string;
  ship: number;
  coupon: string;
  total: number;
  address: string;
  note: string;
  @IsEnum(['pending', 'empty', 'shiping', 'received'])
  statePay: string;
  typePay: string;
}
