import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BillsService } from 'src/bills/bills.service';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class CustomerBillGuard implements CanActivate {
  constructor(
    private readonly customerService: CustomersService,
    private readonly billsService: BillsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request['user'];
    if (!currentUser) {
      throw new UnauthorizedException(
        'Khách hàng không có quyền tương tác giỏ hàng này!',
      );
    }

    if (request.params.idCustomer) {
      const customerId = request.params.idCustomer;
      if (customerId) {
        const customer = await this.customerService.findById(customerId);
        if (customer.username !== currentUser.username) {
          throw new UnauthorizedException(
            'Khách hàng không có quyền tương tác bill này!',
          );
        }
        if(!request.params.idBill) return true;
      } 
    }
    if (request.params.idBill) {
      const idBill = request.params.idBill;
      const bill = await this.billsService.findById(idBill);
      if (bill.idCustomer === currentUser.id) return true;
      throw new UnauthorizedException(
        'Khách hàng không có quyền tương tác bill này!',
      );
    }
  }
}
