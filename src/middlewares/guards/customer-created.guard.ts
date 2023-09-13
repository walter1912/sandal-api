import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { ReviewsService } from 'src/products/reviews/reviews.service';

@Injectable()
export class CustomerCreatedGuard implements CanActivate {
  constructor(
    private readonly customerService: CustomersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request['user'];
    console.log('user cus guard: ', currentUser);
    if (!currentUser) {
      throw new UnauthorizedException('Khách hàng không có quyền này!');
    }
    try {
      if (request.params.idReview) {
        const idReview = request.params.idReview;
        const review = await this.reviewsService.findById(idReview);
        if (review.idCustomer === currentUser.id) return true;
        throw new UnauthorizedException('Khách hàng không có quyền này!');
      }

      if (request.params.id) {
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
      }

      throw new UnauthorizedException('Khách hàng không có quyền này!');
    } catch {
      throw new UnauthorizedException('Khách hàng không có quyền này!');
    }
  }
}
