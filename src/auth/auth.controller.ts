import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseFilters,
  Res,
  Request,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { UserRegsiterDto } from './dto/user-regsiter.dto';
import { HttpExceptionFilter } from 'src/middlewares/all-exception.filter';
import { Request as ReqExpress, Response as ResExpress } from 'express';
import { Public } from 'config/decorations/public.decorator';
import { Roles } from 'config/decorations/roles.decorator';
import { Role } from 'config/enums/role.enum';
import { UserChangeDto } from './dto/user-change.dto';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body, @Res() res: ResExpress) {
    const userDto: UserDto = body;
    const { token } = await this.authService.signIn(userDto);
    if (token)
      res.status(200).json({
        message: 'Đăng nhập thành công',
        token,
      });
  }
  @HttpCode(HttpStatus.OK)
  @Post('change')
  async changePassword(@Body() body, @Res() res: ResExpress) {
    const userChangeDto: UserChangeDto = body;
    const { token } = await this.authService.changePassword(userChangeDto);
    if (token)
      res.status(200).json({
        message: 'Đổi mật khẩu thành công',
        token,
      });
  }
  @Public()
  @Post('register')
  async register(@Body() body, @Res() res: ResExpress) {
    const registerDto: UserRegsiterDto = body;
    const { token } = await this.authService.register(registerDto);
    if (token)
      res.status(201).json({
        message: 'Đăng ký thành công',
        token,
      });
  }

  @Get('profile')
  getProfile(@Request() req, @Res() res: ResExpress) {
    res.status(200).json({
      message: 'Lấy thông tin thành công',
      user: req.user,
    });
  }
  @Roles(Role.Admin)
  @Delete('users/:id')
  async deleteById(@Param() params, @Res() res: ResExpress) {
    try {
      const { id } = params;
      await this.authService.deleteUser(id);
      res.status(200).json({
        message: 'Xoá user thành công',
      });
    } catch (err) {
      console.log('err: ', err);
    }
  }
}
