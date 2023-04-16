import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserReqDto } from './req/user-req.dto';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { UserResDto } from './res/user-res.dto';
export const SALTROUNDS = 10;
@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-users')
  async addUsers(@Body() users: UserReqDto[]) {
    const result = await this.userService.addUsers(users);
    return result;
  }

  @Put('/update-user/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() userInfo: UserReqDto,
  ) {
    const result = await this.userService.update(userId, userInfo);
    return result;
  }

  @Delete('/delete-user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const result = await this.userService.remove(userId);
    return result;
  }

  @Get('/get-all-user')
  async getAllUsers() {
    const result = await this.userService.findAll(UserResDto);
    return result;
  }
}
