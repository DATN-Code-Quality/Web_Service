import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthReqDto } from './req/auth-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './auth.decorator';
import { use } from 'passport';
import { main } from './outlook';
import { UserService } from 'src/user/user.service';
import { UserResDto } from 'src/user/res/user-res.dto';
import { UserReqDto } from 'src/user/req/user-req.dto';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @Public()
  signIn(@Request() req) {
    if (req.user.status === 0) {
      return this.authService.generateToken(req.user);
    } else {
      return req.user;
    }
  }

  @Post('/login/outlook')
  // @UseGuards(LocalAuthGuard)
  @Public()
  async loginWithOutlook() {
    return await this.authService.loginWithOutlook();
  }

  @Get('/profile')
  async getProfile(@Request() req) {
    const userId = req.headers['userId'];
    const result = await this.userService.findOne(UserResDto, userId);
    return result;
  }

  @Put('/')
  async updateUser(@Request() req, @Body() userInfo: UserReqDto) {
    const result = await this.userService.updateUser(
      req.headers.userId,
      userInfo,
    );
    return result;
  }

  @Put('/change-password')
  async changePassword(@Body() data, @Request() req) {
    const userId = req.headers['userId'];
    return this.userService.changePassword(userId, data['password']);
  }

  @Put('/active-account')
  async activeAccount(@Request() req) {
    const userId = req.headers['userId'];
    return this.userService.activeAccount(userId);
  }
}
