import { Module } from '@nestjs/common';
import { AppController } from './app.controller';  
import { AppService } from './app.service';
// để lấy dữ liệu từ các file .env 
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

import { RolesGuard } from './middlewares/guards/roles.guard';
import { AuthGuard } from './middlewares/guards/auth.guard';

import { ValidationPipe } from './middlewares/pipes/validation.pipe';

import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { BillsModule } from './bills/bills.module';
import { CouponsModule } from './coupons/coupons.module';
// kết nối với mongoDB

@Module({
  imports: [
    ConfigModule.forRoot(),   
    MongooseModule.forRoot('mongodb://localhost:27017/sandal-database?retryWrites=true&w=majority'),
    CustomersModule,  
    AuthModule,
    ProductsModule,
    CartModule,
    BillsModule,
    CouponsModule,  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,    
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
