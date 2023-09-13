import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRateDto {
  @IsNotEmpty()
  @IsMongoId()
  idCustomer: string;
  @IsNotEmpty()
  @IsMongoId()
  idProduct: string;
  @IsNotEmpty()
  star: number;
}
