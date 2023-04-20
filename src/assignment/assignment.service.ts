import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentResDto } from './res/assignment-res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationResult } from 'src/common/operation-result';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AssignmentService extends BaseService<
  AssignmentReqDto,
  AssignmentResDto
> {
  constructor(
    @InjectRepository(AssignmentReqDto)
    private readonly assignmentRepository: Repository<AssignmentReqDto>, // @Inject(UsersCoursesService) private readonly usersCoursesService: UsersCoursesService,
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
}
