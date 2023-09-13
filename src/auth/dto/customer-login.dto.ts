import { IsNotEmpty } from 'class-validator';

export class CustomerLoginDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;
}
