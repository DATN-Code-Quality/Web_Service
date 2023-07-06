import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { AssignmentReqDto, ConfigObject } from './req/assignment-req.dto';
import { AssignmentResDto } from './res/assignment-res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { OperationResult } from 'src/common/operation-result';
import { plainToInstance } from 'class-transformer';
import { UserCourseService } from 'src/user-course/user-course.service';
import { SubmissionService } from 'src/submission/submission.service';
import { SUBMISSION_STATUS } from 'src/submission/req/submission-req.dto';
import { ResultService } from 'src/result/result.service';

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
    private readonly resultService: ResultService,
  ) {
    super(assignmentRepository);
  }

  async findAssignmentsByCourseId(
    courseId: string,
    search: string,
    limit: number,
    offset: number,
  ): Promise<OperationResult<any>> {
    const total = await this.assignmentRepository.count({
      where: {
        name: Like(`%${search}%`),
        courseId: courseId,
      },
    });

    return await this.assignmentRepository
      .find({
        order: {
          updatedAt: 'DESC',
        },
        where: {
          name: Like(`%${search}%`),
          courseId: courseId,
        },
        skip: offset,
        take: limit,
      })
      .then((assignments) => {
        return OperationResult.ok({
          total: total,
          assignments: plainToInstance(AssignmentResDto, assignments, {
            excludeExtraneousValues: true,
          }),
        });
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async findAssignmentsByCourseIds(courseIds: string[]): Promise<any> {
    const res = await this.assignmentRepository.find({
      where: {
        courseId: In(courseIds),
      },
    });
    return res;
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
          const { configObject, ...updateAssignment } = assignments[j];
          await this.update(
            savedAssignments[i].id,
            updateAssignment as any,
          ).catch((e) => {
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
  // async exportResult(assignmentId: string) {

  //   const scanResult =
  //     await this.submissionService.countSubmissionByAssignmentIdAndGroupByStatus(
  //       assignmentId,
  //     );

  //   return OperationResult.ok({
  //     total: studentTotal,
  //     submission: scanResult,
  //   });
  // }

  async getTopIssue(assignmentId: string, language: string, limit: number) {
    const submissions =
      await this.submissionService.findSubmissionsByAssigmentId(
        assignmentId,
        null,
        null,
      );

    if (submissions.isOk()) {
      if (submissions.data.total > 0) {
        const submissionIds = submissions.data.submissions.map((submission) => {
          return submission.id;
        });
        return this.resultService.getTopIssue(submissionIds, language, limit);
      } else {
        return OperationResult.ok({
          issue: {
            language: null,
            rules: [],
          },
          languages: [],
        });
      }
    }

    return OperationResult.error(new Error(submissions.message));
  }

  async updateStatusOfSubmissions(config: ConfigObject, assignmentId: string) {
    const passIds = [];
    const failIds = [];

    const submissions =
      await this.submissionService.findSubmissionsByAssigmentId(
        assignmentId,
        null,
        null,
      );

    if (submissions.isOk) {
      if (submissions.data.submissions.length > 0) {
        for (let i = 0; i < submissions.data.submissions.length; i++) {
          if (
            submissions.data.submissions[i].status != SUBMISSION_STATUS.PASS &&
            submissions.data.submissions[i].status != SUBMISSION_STATUS.FAIL
          ) {
            continue;
          }

          const result = await this.resultService.getResultBySubmissionId(
            submissions.data.submissions[i].id,
          );

          if (
            config.code_smells &&
            config.code_smells < result.data['code_smells']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (config.bugs && config.bugs < result.data['bugs']) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (
            config.vulnerabilities &&
            config.vulnerabilities < result.data['vulnerabilities']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }

          if (
            config.violations &&
            config.violations < result.data['violations']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (
            config.blocker_violations &&
            config.blocker_violations < result.data['blocker_violations']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (
            config.critical_violations &&
            config.critical_violations < result.data['critical_violations']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (
            config.major_violations &&
            config.major_violations < result.data['major_violations']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (
            config.minor_violations &&
            config.minor_violations < result.data['minor_violations']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (
            config.info_violations &&
            config.info_violations < result.data['info_violations']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (
            config.duplicated_lines_density &&
            config.duplicated_lines_density <
              result.data['duplicated_lines_density']
          ) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }
          if (config.coverage && config.coverage > result.data['coverage']) {
            failIds.push(submissions.data.submissions[i].id);
            continue;
          }

          passIds.push(submissions.data.submissions[i].id);
        }

        if (passIds.length > 0) {
          this.submissionService
            .updateStatus(passIds, SUBMISSION_STATUS.PASS)
            .then();
        }

        if (failIds.length > 0) {
          this.submissionService
            .updateStatus(failIds, SUBMISSION_STATUS.FAIL)
            .then();
        }
      }

      return OperationResult.ok('Update success');
    } else {
      return OperationResult.error(new Error(submissions.message));
    }
  }
}
