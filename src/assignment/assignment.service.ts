import { Injectable, Inject, forwardRef } from '@nestjs/common';
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
    @Inject(forwardRef(() => UserCourseService))
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

  async upsertAssignments(
    assignments: AssignmentReqDto[],
  ): Promise<OperationResult<any>> {
    const moodleIds = assignments.map((assignment) => {
      return assignment.assignmentMoodleId;
    });

    const savedAssignments = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where(
        'assignment.assignmentMoodleId IN (:...moodleIds) and assignment.deletedAt is null',
        {
          moodleIds: moodleIds,
        },
      )
      .getMany()
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return [];
      });

    const insertAssignments = [];
    const updatedAssignmentIds = [];

    for (let j = 0; j < assignments.length; j++) {
      let isExist = false;
      for (let i = 0; i < savedAssignments.length; i++) {
        if (
          assignments[j].assignmentMoodleId ==
          savedAssignments[i].assignmentMoodleId
        ) {
          await this.assignmentRepository
            .update(savedAssignments[i].id, assignments[j])
            .catch((e) => {
              return OperationResult.error(
                new Error(`Can not import assignments: ${e.message}`),
              );
            });
          isExist = true;
          updatedAssignmentIds.push(savedAssignments[i].id);
          break;
        }
      }
      if (!isExist) {
        insertAssignments.push(assignments[j]);
      }
    }

    const insertResult = await this.createMany(
      AssignmentResDto,
      insertAssignments,
    );

    if (insertResult.isOk()) {
      if (updatedAssignmentIds.length > 0) {
        return this.assignmentRepository
          .createQueryBuilder('assignment')
          .where(
            'assignment.id IN (:...ids) and assignment.deletedAt is null',
            {
              ids: updatedAssignmentIds,
            },
          )
          .getMany()
          .then((upsertedAssignments) => {
            insertResult.data.forEach((assignment) => {
              upsertedAssignments.push(assignment);
            });
            return OperationResult.ok(
              plainToInstance(AssignmentResDto, upsertedAssignments, {
                excludeExtraneousValues: true,
              }),
            );
          })
          .catch((e) => {
            return OperationResult.error(new Error(e));
          });
      } else {
        return insertResult;
      }
    } else {
      return OperationResult.error(
        new Error(`Can not import assignments: ${insertResult.message}`),
      );
    }
  }
}
