import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  // username: string
  name: string;
  // email: string
  // phone: string
  address: string;
  gender: string;
  dob: string;
  type: number;
}
