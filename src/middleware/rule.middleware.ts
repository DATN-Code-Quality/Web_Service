import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { AssignmentService } from 'src/assignment/assignment.service';
import { AssignmentResDto } from 'src/assignment/res/assignment-res.dto';
import { UserCourseResDto } from 'src/user-course/res/user-course-res.dto';
import { UserCourseService } from 'src/user-course/user-course.service';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(
    private readonly usercourse: UserCourseService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const courseId = req.params['courseId'];

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const payload = this.jwtService.verify(token);

    return await this.usercourse
      .findUserCoursesByCourseIdAndUserId(courseId, payload.user.id)
      .then((usercourse) => {
        if (usercourse) {
          req.headers['role'] = usercourse.role;
          next();
          return;
        } else {
          return res.status(200).json({
            status: 1,
            message: `You are not a member of course ${courseId}`,
          });
        }
      })
      .catch((e) => {
        return res.status(200).json({
          status: 1,
          message: e.message,
        });
      });
  }
}
