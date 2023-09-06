import { Controller, Param, Get, Put, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schema/user.schema';
import { UserDto } from '../dto/user.dto';

@Controller('auth/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id')
    id: string,
    @Body()
    user: UserDto,
  ): Promise<User> {
    return this.userService.updateById(id, user);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.deleteById(id);
  }
}
