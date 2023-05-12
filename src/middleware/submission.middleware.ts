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
import { SubRole } from 'src/auth/auth.const';
import { SubmissionResDto } from 'src/submission/res/submission-res.dto';
import { SubmissionService } from 'src/submission/submission.service';

@Injectable()
export class SubmissionMiddleware implements NestMiddleware {
  constructor(
    private readonly submissionService: SubmissionService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const assignmentId = req.params['assignmentId'];
    const submissionId = req.params['submissionId'];

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const payload = this.jwtService.verify(token);

    const result = await this.submissionService.findOne(
      SubmissionResDto,
      submissionId,
    );

    if (result.isOk()) {
      if (result.data.assignmentId === assignmentId) {
        if (req.headers['role'] === SubRole.TEACHER) {
          next();
          return;
        } else {
          if (result.data.userId === payload.user.id) {
            next();
            return;
          } else {
            return res.status(200).json({
              status: 1,
              message: `Not the owner of submission ${submissionId}`,
            });
          }
        }
      } else {
        return res.status(200).json({
          status: 1,
          message: `In assignment ${assignmentId}, there is no submission ${submissionId}`,
        });
      }
    }

    return res.status(200).json({
      status: 1,
      message: `No submission with ID as ${submissionId}`,
    });
  }
}
