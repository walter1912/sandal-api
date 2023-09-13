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

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private jwtService: JwtService, // @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(registerDto: CustomerRegisterDto): Promise<{ token: string }> {
    // LƯU VÀO DATABASE KHÁCH HÀNG
    try {
      const { password } = registerDto;
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      // Store hash in your password DB.

      let customerPost = { ...registerDto, password: hashed };
      let user = await this.customerService.create(customerPost);
      let token = await this.createToken(user);
      return { token };
    } catch (err) {
      throw new BadRequestException('Tạo tài khoản không thành công!');
    }
  }

  async login(customerLoginDto: CustomerLoginDto): Promise<{ token: string }> {
    let token = '';
    const { userExisted } = await this.checkUserExist(customerLoginDto);
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
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ token: string }> {
    let token = '';
    const { username, oldPassword, newPassword } = changePasswordDto;

    const userDto: CustomerLoginDto = { username, password: oldPassword };
    const { userExisted } = await this.checkUserExist(userDto);
    if (userExisted) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);

      const id = userExisted._id;
      const newUser = await this.customerService.changePassword(id, hashed);
      token = await this.createToken(newUser);
    }
    return { token };
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

  async createToken(user): Promise<string> {
    let roles = user.roles ? user.roles : '2';

    let id = await user.id.toString();
    // console.log('strId: ', strId);
    // let intId: Number = Number(strId.substring(strId.length - 1, strId.length)) - 2;
    // let id: string = strId.substring(0, strId.length - 1) + String(intId);
    console.log('user._id: ', await user);

    const payload = { id, username: user.username, roles };
    let access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }
}
// 64fa2e230465ea4d846ca635
// real: 64fa2e230465ea4d846ca633
