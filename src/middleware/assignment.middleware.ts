import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AssignmentService } from 'src/assignment/assignment.service';
import { AssignmentResDto } from 'src/assignment/res/assignment-res.dto';

@Injectable()
export class AssignmentMiddleware implements NestMiddleware {
  constructor(private readonly assignmentService: AssignmentService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const courseId = req.params['courseId'];
    const assignmentId = req.params['assignmentId'];
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    if (regexExp.test(assignmentId) == false) {
      next();
      return;
    }

    const result = await this.assignmentService.findOne(
      AssignmentResDto,
      assignmentId,
    );
    if (result.isOk()) {
      if (result.data.courseId === courseId) {
        next();
        return;
      }
    }
    return res.status(200).json({
      status: 1,
      message: `In course ${courseId}, there is no assignment ${assignmentId}`,
    });
  }
}
