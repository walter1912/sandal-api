import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { CartService } from 'src/cart/cart.service';
  import { CustomersService } from 'src/customers/customers.service';
  
  @Injectable()
  export class CustomerCartGuard implements CanActivate {
    constructor(
      private readonly customerService: CustomersService,
      private readonly cartService: CartService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const currentUser = request['user'];
      console.log('user cus guard: ', currentUser);
      if (!currentUser) {
        throw new UnauthorizedException('Khách hàng không có quyền tương tác giỏ hàng này!');
      }
      try {
      
        if (request.params.idItem) {
          const idProductCart = request.params.idItem;
          const productCart = await this.cartService.findById(idProductCart);
          if (productCart.idCustomer === currentUser.id) return true;
          throw new UnauthorizedException('Khách hàng không có quyền tương tác giỏ hàng này!');
        }
  
        if (request.params.idCustomer) {
          const customerId = request.params.idCustomer;
          if (customerId) {
            const customer = await this.customerService.findById(customerId);
            if (customer.username === currentUser.username) return true;
          }
        }
  
        throw new UnauthorizedException('Khách hàng không có quyền tương tác giỏ hàng này!');
      } catch {
        throw new UnauthorizedException('Khách hàng không có quyền tương tác giỏ hàng này!');
      }
    }
  }
  