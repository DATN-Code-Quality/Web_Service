import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.getArgByIndex(0),
    );
    const payload = this.jwtService.verify(token);
    context.getArgByIndex(0).headers['userId'] = payload.user.id;

    return super.canActivate(context);
  }
}
