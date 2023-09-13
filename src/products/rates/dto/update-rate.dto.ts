import { IsNotEmpty } from 'class-validator';

export class UpdateRateDto {
  @IsNotEmpty()
  star: number;
}
