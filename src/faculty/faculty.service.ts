import { DefaultValuePipe, Injectable, Query, Request } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { Role, SubRole } from 'src/auth/auth.const';
import { ResultResDto } from 'src/result/res/result-res.dto';
import { ResultService } from 'src/result/result.service';
import { SubmissionService } from 'src/submission/submission.service';
import { UserCourseService } from 'src/user-course/user-course.service';

@Injectable()
export class FacultyService {
  constructor(
    private readonly resultService: ResultService,
    private readonly submissionService: SubmissionService,
    private readonly userService: UserService,
    private readonly userCourseService: UserCourseService,
    private readonly assigmentService: AssignmentService,
  ) {}

  async getStatistic() {
    return await this.resultService.getAvgResults();
  }

  async getUserStatistic(search: string, limit: number, offset: number) {
    const users = await this.userService.findUserHasSubmission(
      search,
      limit,
      offset,
    );
    if (!users.isOk()) {
      return OperationResult.error(new Error(users.message));
    }

    const res = [];
    for (let i = 0; i < users.data['users'].length; i++) {
      const submissionIds = users.data['users'][i].submissions.map(
        (submission) => {
          return submission.id;
        },
      );
      const result = await this.resultService.getAvgResultsBySubmissionIds(
        submissionIds,
      );
      if (result.isOk()) {
        res.push({
          user: {
            id: users.data['users'][i].id,
            name: users.data['users'][i].name,
            email: users.data['users'][i].email,
            userId: users.data['users'][i].userId,
          },
          result: result.data,
        });
      }
    }
    return OperationResult.ok({
      total: users.data['total'],
      results: res,
    });
  }

  async getResultbyUserId(userId: string) {
    const courseData = await this.userCourseService.findCoursesByUserId(
      userId,
      SubRole.STUDENT,
      '',
      null,
      null,
      null,
      null,
    );

    let courses = [];
    let assignments = [];

    if (courseData.isOk()) {
      courses = courseData.data.courses;
      assignments = await this.assigmentService.findAssignmentsByCourseIds(
        courses.map((course) => course.id),
      );
    }

    let results = [];
    let submissionIds = [];

    const mapSubmission = new Map<string, any>();

    for (let i = 0; i < assignments.length; ++i) {
      const assignment = assignments[i];

      const submission =
        await this.submissionService.findSubmissionsByAssigmentIdAndUserId(
          assignment.id,
          userId,
        );

      if (submission.isOk() && submission.data.submissions.length > 0) {
        const submissionList = submission.data.submissions;

        const foundSubmission = submissionList.find((submission) => {
          return submission.userId === userId;
        });

        if (foundSubmission) {
          submissionIds.push(foundSubmission.id);
          mapSubmission.set(foundSubmission.id, assignment);
        }
      }
    }

    if (submissionIds.length > 0) {
      const temp = (await this.resultService.getResultsBySubmissionIds(
        submissionIds,
      )) as any;

      results = temp.map((item) => ({
        result: item,
        assignment: mapSubmission.get(item.submissionId),
      }));
    }

    return { assignments, results, courses };
  }
}
