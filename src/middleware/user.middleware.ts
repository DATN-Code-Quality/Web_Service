import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { SubmissionResDto } from 'src/submission/res/submission-res.dto';
import { SubmissionService } from 'src/submission/submission.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly submissionService: SubmissionService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const submissionId = req.params['submissionId'];

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const payload = this.jwtService.verify(token);

    const result = await this.submissionService.findOne(
      SubmissionResDto,
      submissionId,
    );

    if (result.isOk()) {
      if (result.data.userId === payload.user.id) {
        next();
        return;
      } else {
        return res.status(200).json({
          status: 0,
          message: `Not the owner of submission ${submissionId}`,
        });
      }
    }

    return res.status(200).json({
      status: 0,
      message: `No submission with ID as ${submissionId}`,
    });
  }
}
