import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserRegsiterDto } from './dto/user-regsiter.dto';
import { CreateCustomerDto } from 'src/customers/dto/create-customer.dto';
import { CustomersService } from 'src/customers/customers.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { UserChangeDto } from './dto/user-change.dto';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(registerDto: UserRegsiterDto): Promise<{ token: string }> {
    let token = '';
    let { password, username, ...customer } = registerDto;

    let customerDto: CreateCustomerDto;
    customerDto = { username, ...customer };
    // LƯU VÀO DATABASE KHÁCH HÀNG
    try {
      await this.customerService.create(customerDto);
    } catch (err) {
      throw new BadRequestException(
        'Tạo tài khoản khách hàng không thành công!',
      );
    }
    // LƯU VÀO DATABASE USER
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      // Store hash in your password DB.
      let userDto: UserDto;
      userDto = { username, password: hashed };
      let user = new this.userModel(userDto).save();
      token = await this.createToken(user);
    } catch (err) {
      throw new BadRequestException('Tạo tài khoản không thành công!');
    }
    return { token };
  }

  async signIn(userDto: UserDto): Promise<{ token: string }> {
    let token = '';
    const { userExisted } = await this.checkUserExist(userDto);
    if (userExisted) {
      //login
      console.log('Đăng nhập thành công');
      token = await this.createToken(userExisted);
    }
    if (token === '')
      throw new UnauthorizedException('Đăng nhập không thành công!');
    return { token };
  }

  async changePassword(
    userChangeDto: UserChangeDto,
  ): Promise<{ token: string }> {
    let token = '';
    const { username, oldPassword, newPassword } = userChangeDto;
    const userDto: UserDto = { username, password: oldPassword };
    const { userExisted } = await this.checkUserExist(userDto);
    if (userExisted) {
      const putUser: UserDto = { ...userExisted, password: newPassword };
      const id = userExisted._id;
      const newUser = await this.userModel.findByIdAndUpdate(id, putUser, {
        new: true,
        runValidators: true,
      });
      token = await this.createToken(newUser);
    }
    return { token };
  }

  async checkUserExist(userDto: UserDto): Promise<{ userExisted: any }> {
    const userExisted = await this.userModel.findOne({
      username: userDto.username,
    });
    if (!userExisted) {
      throw new UnauthorizedException('Không tìm thấy user!');
    }
    // check login
    let existed = await bcrypt.compare(userDto.password, userExisted.password);
    if (!existed) {
      throw new UnauthorizedException('Mật khẩu không đúng!');
    }
    return { userExisted };
  }

  async deleteUser(id: string): Promise<User> {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Vui lòng nhập đúng id!');
    }
    const existed: User = await this.userModel.findById(id);
    if (!existed) {
      throw new NotFoundException('Không tìm thấy user!');
    }
    return await this.userModel.findByIdAndDelete(id);
  }

  async createToken(user): Promise<string> {
    const payload = { id: user._id, username: user.username };
    let access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }
  
}
