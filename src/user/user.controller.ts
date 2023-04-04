import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserReqDto } from './req/user-req.dto';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { UserResDto } from './res/user-res.dto';
const SALTROUNDS = 10;
@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-users')
  async addUsers(@Body() users: UserReqDto[]) {
    const salt = await bcrypt.genSalt(SALTROUNDS);
    const hash = users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return {
        ...user,
        password: hashedPassword,
      };
    });
    const usersAdded = [] as UserReqDto[];
    for (let i = 0; i < hash.length; i++) {
      usersAdded.push(await hash[i]);
    }
    const result = await this.userService.createMany(UserResDto,usersAdded);
    return result;
  }

  @Put('/update-user/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() userInfo: UserReqDto,
  ) {
    console.log('userId', userId);
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
