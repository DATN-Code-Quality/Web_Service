import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ServiceResponse } from 'src/common/service-response';
import { UserReqDto } from './req/user-req.dto';

@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-users')
  async addUsers(@Body() users: UserReqDto[]) {
    const result = await this.userService.addUsers(users);
    return ServiceResponse.fromResult(result);
  }
}
