import { DefaultValuePipe, Injectable, Query, Request } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultService } from 'src/result/result.service';
import { SubmissionService } from 'src/submission/submission.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FacultyService {
  constructor(
    private readonly resultService: ResultService,
    private readonly submissionService: SubmissionService,
    private readonly userService: UserService,
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
}
