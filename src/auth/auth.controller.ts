import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  Put,
  Query,
  DefaultValuePipe,
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
import { USER_STATUS, UserReqDto } from 'src/user/req/user-req.dto';
import { OperationResult } from 'src/common/operation-result';
import { JwtService } from '@nestjs/jwt';
import { templatePasswordHtml } from 'src/config/templatePasswordHtml';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private jwtService: JwtService,
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
  async loginWithOutlook(@Body() data: object) {
    const token = data['token'];
    if (token) {
      return await this.authService.loginWithOutlook(token);
    } else {
      return OperationResult.error(new Error("field 'token' is missed"));
    }
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

  // Call this api when user has logged and want change password
  @Put('/change-password')
  async changePassword(@Body() data, @Request() req) {
    const userId = req.headers['userId'];
    const oldPassword = data['oldPassword'];
    const newPassword = data['newPassword'];

    const userById = await this.userService.findOne(UserResDto, userId);
    console.log(userById);

    if (!userById.isOk()) {
      return OperationResult.error(
        new Error(
          'Cannot find user by id. Please check your token or contact admin',
        ),
      );
    }

    const user = await this.userService.findUserByUsernameAndPassword(
      userById.data.userId,
      oldPassword,
    );
    if (user.isOk()) {
      if (newPassword && this.isInValidPassword(newPassword) === 0) {
        return this.userService.changePassword(userId, newPassword);
      }
      return OperationResult.error(
        new Error(
          'The new password is not valid. Password length must be longer than 8',
        ),
      );
    } else {
      return user;
    }
  }

  // Call this api when first login or forget password (after user click into link attached in mail and change password)
  @Put('/change-password-without-old-password')
  @Public()
  async changePasswordVithoutOldPassword(
    @Body() data,
    @Query('token', new DefaultValuePipe('')) token: string,
  ) {
    const newPassword = data['newPassword'];
    if (newPassword && this.isInValidPassword(newPassword) === 0) {
      return this.authService.changePassword(token, newPassword);
    }
    return OperationResult.error(
      new Error(
        'The new password is not valid. Password length must be longer than 8',
      ),
    );
  }

  //Call this api when click button "Forget password" (then systen will send mail to user's mail)
  @Public()
  @Put('/forget-password')
  async forgetPassword(@Body() data) {
    const username = data['username'];
    const user = await this.userService.findUserByUsername(username);
    if (user.isOk()) {
      const token = this.jwtService.sign({
        userId: user.data.id,
      });
      // Hàm send mail chỗ này

      this.userService.sendEmail(
        user.data,
        templatePasswordHtml(user.data, token, false),
        'Reset Password',
      );
      return OperationResult.ok('Please check mail to set new password');
    } else {
      return user;
    }
  }

  //Call this api when active account
  @Public()
  @Put('/active-account')
  async activeAccount(@Query('token', new DefaultValuePipe('')) token: string) {
    return this.userService.activeAccount(token);
  }

  isInValidPassword(password: string): number {
    if (password.length < 8) {
      return 1;
    }
    return 0;
  }
}
