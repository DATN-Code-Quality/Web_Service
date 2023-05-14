import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthReqDto } from './req/auth-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './auth.decorator';
import { use } from 'passport';
import { main } from './outlook';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
