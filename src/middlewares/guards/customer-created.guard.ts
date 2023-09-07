import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class CustomerCreatedGuard implements CanActivate {
  constructor(private customerService: CustomersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request['user'];
    console.log("user cus guard: ", currentUser);
    if (!currentUser) {
      throw new UnauthorizedException('Khách hàng không có quyền này!');
    }
    try {
      const customerId = request.params.id;
      if (customerId) {
        const customer = await this.customerService.findById(customerId);
        if (customer.username === currentUser.username) return true;
      }
      const customerUsername = request.params.username;
      if (customerUsername) {
        const customer =
          await this.customerService.findByUsername(customerUsername);
        if (customer.username === currentUser.username) return true;
      }
      throw new UnauthorizedException('Khách hàng không có quyền này!');
    } catch {
      throw new UnauthorizedException('Khách hàng không có quyền này!');
    }
  }
}
