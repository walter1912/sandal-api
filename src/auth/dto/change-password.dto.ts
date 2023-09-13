import {  IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly oldPassword: string;
  @IsNotEmpty()
  readonly newPassword: string;
  
}
