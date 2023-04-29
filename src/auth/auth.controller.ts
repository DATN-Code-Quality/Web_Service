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

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @Public()
  signIn(@Body() signInDto: AuthReqDto, @Request() req) {
    return this.authService.generateToken(req.user);
  }
}
