import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rate } from './schema/rate.schema';
import { Model } from 'mongoose';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from '../products.service';
import { CreateRateDto } from './dto/create-rate.dto';

@Injectable()
export class RatesService {
  constructor(
    @InjectModel(Rate.name) private rateModel: Model<Rate>,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  async create(createRateDto: CreateRateDto) {
    const { idCustomer, idProduct } = createRateDto;
    await this.customersService.findById(idCustomer);
    await this.productsService.findById(idProduct);
    const existed = await this.rateModel.findOne({ idCustomer, idProduct });
    if (existed) {
      return await this.rateModel.findByIdAndUpdate(existed.id, createRateDto, {
        new: true,
      });
    }
    const rate = await new this.rateModel(createRateDto).save();
    return rate;
  }

  async getRateProduct(idProduct: string) {
    await this.productsService.findById(idProduct);

    let rates: Rate[] = await this.rateModel.find({ idProduct });
    let rateProduct = 0;
    for (let i = 0; i < rates.length; i++) {
      rateProduct += rates[i].star;
    }
    if (rateProduct > 0) {
      rateProduct = rateProduct / rates.length;
    }
    return rateProduct;
  }
}
