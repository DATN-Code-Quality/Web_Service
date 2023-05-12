import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentResDto } from './res/assignment-res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationResult } from 'src/common/operation-result';
import { plainToInstance } from 'class-transformer';
import { UserCourseService } from 'src/user-course/user-course.service';
import { SubmissionService } from 'src/submission/submission.service';
import { SUBMISSION_STATUS } from 'src/submission/req/submission-req.dto';

@Injectable()
export class AssignmentService extends BaseService<
  AssignmentReqDto,
  AssignmentResDto
> {
  constructor(
    @InjectRepository(AssignmentReqDto)
    private readonly assignmentRepository: Repository<AssignmentReqDto>, // @Inject(UsersCoursesService) private readonly usersCoursesService: UsersCoursesService,
    private readonly submissionService: SubmissionService,
    private readonly usercourseService: UserCourseService,
  ) {
    super(assignmentRepository);
  }

  async findAssignmentsByCourseId(
    courseId: string,
  ): Promise<OperationResult<Array<AssignmentResDto>>> {
    let result: OperationResult<Array<AssignmentResDto>>;

    await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where(
        'assignment.courseId = :courseId and assignment.deletedAt is null',
        { courseId: courseId },
      )
      .getMany()
      .then((assignments) => {
        result = OperationResult.ok(
          plainToInstance(AssignmentResDto, assignments, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async getReport(courseId: string, assignmentId: string) {
    const studentTotal =
      await this.usercourseService.countStudentTotalByCourseId(courseId);
    const scanResult =
      await this.submissionService.countSubmissionByAssignmentIdAndGroupByStatus(
        assignmentId,
      );

    return OperationResult.ok({
      total: studentTotal,
      submission: scanResult,
    });
  }
}
