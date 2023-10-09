import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerRegisterDto } from './dto/customer-regsiter.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Customer } from 'src/customers/schema/customer.schema';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private jwtService: JwtService, // @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(registerDto: CustomerRegisterDto) {
    // LƯU VÀO DATABASE KHÁCH HÀNG
    try {
      const { password } = registerDto;
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      // Store hash in your password DB.

      let customerPost = { ...registerDto, password: hashed };
      let user = await this.customerService.create(customerPost);
      let token = await this.createToken(user);
      return token;
    } catch (err) {
      throw new BadRequestException(`Tạo tài khoản không thành công! err: ${err}`);
    }
  }

  async login(customerLoginDto: CustomerLoginDto) {
    let token = {
      access_token: '',
    };
    const { userExisted } = await this.checkUserExist(customerLoginDto);
    if (userExisted) {
      //login
      console.log('Đăng nhập thành công');
      token = await this.createToken(userExisted);
    }
    if (token.access_token === '')
      throw new UnauthorizedException('Đăng nhập không thành công!');
    return token;
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { username, oldPassword, newPassword } = changePasswordDto;

    const userDto: CustomerLoginDto = { username, password: oldPassword };
    const { userExisted } = await this.checkUserExist(userDto);
    let token = {};
    if (userExisted) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);

      const id = userExisted._id;
      const newUser = await this.customerService.changePassword(id, hashed);
      token = await this.createToken(newUser);
    }
    return token;
  }

  async checkUserExist(
    userDto: CustomerLoginDto,
  ): Promise<{ userExisted: any }> {
    const { username, password } = userDto;
    const userExisted = await this.customerService.findByUsername(username);
    if (!userExisted) {
      throw new UnauthorizedException('Không tìm thấy user!');
    }
    // check login
    let existed = await bcrypt.compare(password, userExisted.password);
    if (!existed) {
      throw new UnauthorizedException('Mật khẩu không đúng!');
    }
    return { userExisted };
  }

  async createToken(
    user,
    refresh = true,
  ): Promise<{ access_token: string; refreshToken?: object }> {
    let role = user.role ? user.role : '2';

    let id = await user.id.toString();
    // console.log('strId: ', strId);
    // let intId: Number = Number(strId.substring(strId.length - 1, strId.length)) - 2;
    // let id: string = strId.substring(0, strId.length - 1) + String(intId);
    console.log('user._id: ', await user);

    const payload = { id, username: user.username, role };
    let access_token = await this.jwtService.signAsync(payload);
    if (refresh) {
      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.EXPIRESIN_REFRESH,
      });
      await this.customerService.updateRefreshToken(
        user.username,
        refresh_token,
      );
      let refreshToken = {
        refresh_token,
        expiresInRefresh: process.env.EXPIRESIN_REFRESH,
      };
      return {
        access_token,
        refreshToken,
      };
    } else {
      return { access_token };
    }
  }
  // refresh token

  async refresh(refresh_token) {
    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      console.log("payload: ", payload);
      
      const user = await this.customerService.getUserByRefresh(
        payload.username,
        refresh_token, 
      );
      const token = await this.createToken(user, false);
      console.log('refresh_token: ', refresh_token);
      return {
        username: user.username,
        ...token,
      };
      
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async logout(customer: Customer) {
    await this.customerService.removeRT(customer.username);
  }
}
