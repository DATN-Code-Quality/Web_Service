import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, SUB_ROLES_KEY } from '../auth.decorator';
import { Role } from '../auth.const';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserCourseService } from 'src/user-course/user-course.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.getArgByIndex(0),
    );
    const payload = this.jwtService.verify(token);
    console.log(requiredRoles.some((role) => payload.user.role === role));
    console.log(requiredRoles);
    console.log(payload.user.role);

    return requiredRoles.some((role) => payload.user.role === role);
  }
}
