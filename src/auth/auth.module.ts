import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { jwtConstants } from './constants';
import { User, UserSchema } from './schema/user.schema';
import { Model } from 'mongoose';

@Module({
  imports: [
    CustomersModule,

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  // exports: [AuthService, AuthModule],
})
export class AuthModule {}
