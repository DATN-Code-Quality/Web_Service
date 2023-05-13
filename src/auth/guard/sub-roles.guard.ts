import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, SUB_ROLES_KEY } from '../auth.decorator';
import { Role } from '../auth.const';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserCourseService } from 'src/user-course/user-course.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { SubmissionService } from 'src/submission/submission.service';
import { AssignmentResDto } from 'src/assignment/res/assignment-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { SubmissionResDto } from 'src/submission/res/submission-res.dto';

@Injectable()
export class SubRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userCourseService: UserCourseService, // private assignmentService: AssignmentService,
  ) // private submissionService: SubmissionService,
  {}

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

    if (requiredSubRoles.some((role) => payload.user.role === role)) {
      return true;
    }

    if (requiredSubRoles) {
      const courseId = context.getArgByIndex(0).param('courseId');
      const assignmentId = context.getArgByIndex(0).param('assignmentId');
      const submissionId = context.getArgByIndex(0).param('submissionId');
      const projectId = context.getArgByIndex(0).param('projectId');

      // if (assignmentId) {
      //   const result = await this.assignmentService.findOne(
      //     AssignmentResDto,
      //     assignmentId,
      //   );
      //   if (!result.isOk()) {
      //     return false;
      //   }
      // }

      // if (submissionId) {
      //   const result = await this.submissionService.findOne(
      //     SubmissionResDto,
      //     assignmentId,
      //   );
      //   if (!result.isOk()) {
      //     return false;
      //   }
      // }

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
          return false;
        });
    }
    // return isTrueSubRole;
  }
}
