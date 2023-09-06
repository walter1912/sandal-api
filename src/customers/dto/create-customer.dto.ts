import { IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly name: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly phone: string;
  @IsNotEmpty()
  readonly address: string;
  @IsDateString()
  readonly dob: string;
  readonly gender: string;
  // type: number default type=0
}
