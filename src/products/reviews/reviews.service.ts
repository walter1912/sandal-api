import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from '../products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  async getReviewsByIdCustomer(idCustomer: string) {
    if (!isValidObjectId(idCustomer)) {
      throw new BadRequestException('Id Product bị sai');
    }
   
    return await this.reviewModel.find({ idCustomer }).exec();
  }

  async getReviewsByIdProduct(idProduct: string, limit: number) {
    if (!isValidObjectId(idProduct)) {
      throw new BadRequestException('Id Product bị sai');
    }
    if (limit === 0) {
      return await this.reviewModel.find({ idProduct });
    }
    return await this.reviewModel.find({ idProduct }).limit(limit).exec();
  }
  
  async create(createReviewDto: CreateReviewDto) {
    await this.customersService.findById(createReviewDto.idCustomer);
    await this.productsService.findById(createReviewDto.idProduct);

    const review = await new this.reviewModel(createReviewDto).save();
    return review;
  }
  async findById(id: string): Promise<Review> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id không phải là mongo ID!');
    }
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException('Không tìm thấy review');
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findById(id);

    const putReview = {
      review,
      content: updateReviewDto.content,
    };
    return await this.reviewModel.findByIdAndUpdate(id, putReview, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.reviewModel.findByIdAndRemove(id);
  }
}
