import {  IsDateString, IsEmail, IsNotEmpty} from 'class-validator';

export class CustomerRegisterDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;
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
  readonly role: string;
  readonly type: Number;

}
