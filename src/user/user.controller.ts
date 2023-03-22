import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-users')
  async addUsers(@Body() users: UserReqDto[]) {
    // return await this.appService.getHello();
  }
}
