import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ServiceResponse } from 'src/common/service-response';
import { UserReqDto } from './req/user-req.dto';
import { UserResDto } from './res/user-res.dto';

@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-users')
  async addUsers(@Body() users: UserReqDto[]) {
    const result = await this.userService.addUsers(users);
    return ServiceResponse.fromResult(result);
  }

  @Put('/update-user')
  async updateUser(
    @Param('userId') userId: string,
    @Body() userInfo: UserReqDto, // : Promise<ServiceResponse<UserResDto>>
  ) {
    const result = await this.userService.updateUser(userInfo, userId);
    return ServiceResponse.fromResult(result);
  }
}
