import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { AssignmentService } from 'src/assignment/assignment.service';
import { AssignmentResDto } from 'src/assignment/res/assignment-res.dto';
import { GMoodleService } from 'src/gRPc/services/moodle';
import { UserCourseResDto } from 'src/user-course/res/user-course-res.dto';
import { UserCourseService } from 'src/user-course/user-course.service';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class MoodleMiddleware implements NestMiddleware {
  private gMoodleService: GMoodleService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.gMoodleService =
      this.client.getService<GMoodleService>('GMoodleService');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const isConnect = await firstValueFrom(
      await this.gMoodleService.IsMoodleConnected({}),
    );
    if (isConnect.error === 0 && isConnect.data) {
      next();
    } else {
      return res.status(200).json({
        status: 1,
        message: `Has not connected to moodle`,
      });
    }
  }
}
