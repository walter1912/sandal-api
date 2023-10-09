import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseFilters,
  Res,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/middlewares/all-exception.filter';
import { Request as ReqExpress, Response as ResExpress } from 'express';
import { Public } from 'config/decorations/public.decorator';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CustomerRegisterDto } from './dto/customer-regsiter.dto';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body, @Res() res: ResExpress) {
    const userDto: CustomerLoginDto = body;
    const token = await this.authService.login(userDto);

    res.status(200).json({
      message: 'Đăng nhập thành công',
      ...token,
    });
  }
  @HttpCode(HttpStatus.OK)
  @Post('change')
  async changePassword(@Body() body, @Res() res: ResExpress) {
    const changePasswordDto: ChangePasswordDto = body;
    const token =
      await this.authService.changePassword(changePasswordDto);
  
      res.status(200).json({
        message: 'Đổi mật khẩu thành công',
        ...token,
      });
  }
  @Public()
  @Post('register')
  async register(@Body() body, @Res() res: ResExpress) {
    const customerRegisterDto: CustomerRegisterDto = body;
    const token =
      await this.authService.register(customerRegisterDto);
    
      res.status(201).json({
        message: 'Đăng ký thành công',
        ...token,
      });
  }
// 
@Public()
  @Post('refreshToken')
  async refreshToken(@Body() body) {
    return await this.authService.refresh(body.refresh_token);
  }
 
  @Get('profile')
  getProfile(@Request() req, @Res() res: ResExpress) {
    res.status(200).json({
      message: 'Lấy thông tin thành công',
      user: req.user,
    });
  }
}
