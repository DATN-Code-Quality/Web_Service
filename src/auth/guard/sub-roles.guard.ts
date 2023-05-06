import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, SUB_ROLES_KEY } from '../auth.decorator';
import { Role } from '../auth.const';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserCourseService } from 'src/user-course/user-course.service';

@Injectable()
export class SubRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userCourseService: UserCourseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredSubRoles = this.reflector.getAllAndOverride<Role[]>(
      SUB_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredSubRoles) {
      return true;
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.getArgByIndex(0),
    );
    const payload = this.jwtService.verify(token);

    if (requiredSubRoles) {
      const courseId = context.getArgByIndex(0).param('courseId');
      return await this.userCourseService
        .findUserCoursesByCourseIdAndUserId(courseId, payload.user.id)
        .then((userCourse) => {
          if (userCourse === null) {
            return false;
          } else {
            context.getArgByIndex(0).headers['role'] = userCourse.role;
            context.getArgByIndex(0).headers['userId'] = payload.user.id;

            return requiredSubRoles.some((role) => userCourse.role === role);
          }
        })
        .catch((e) => {
          console.log(e);
          return false;
        });
    }
    // return isTrueSubRole;
  }
}
