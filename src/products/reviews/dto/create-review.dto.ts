import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsMongoId()
  idCustomer: string;
  @IsNotEmpty()
  @IsMongoId()
  idProduct: string;
  @IsNotEmpty()
  content: string;
}

