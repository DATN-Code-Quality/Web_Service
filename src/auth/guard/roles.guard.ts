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

    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
        context.getArgByIndex(0),
      );
      const payload = this.jwtService.verify(token);
      context.getArgByIndex(0).headers['userId'] = payload.user.id;

      if (!requiredRoles) {
        return true;
      }

      if (requiredRoles.some((role) => payload.user.role === role)) {
        return true;
      } else {
        context.getArgByIndex(1).status(200).json({
          status: 1,
          message: `You can not call this api`,
        });
      }

      return;
    } catch (error) {
      if (
        context.getArgByIndex(0).route.path.includes('/api/auth/login') ||
        context.getArgByIndex(0).route.path.includes('/api/auth/active-account')
      ) {
        return true;
      }
      return context.getArgByIndex(1).status(200).json({
        status: 1,
        message: `Unauthenticated`,
      });
    }
  }
}
