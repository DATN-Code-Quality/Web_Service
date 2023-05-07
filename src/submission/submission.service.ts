import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { SubmissionReqDto } from './req/submission-req.dto';
import { SubmissionResDto } from './res/submission-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { Role, SubRole } from 'src/auth/auth.const';
import { UserResDto } from 'src/user/res/user-res.dto';

@Injectable()
export class SubmissionService extends BaseService<
  SubmissionReqDto,
  SubmissionResDto
> {
  constructor(
    @InjectRepository(SubmissionReqDto)
    private readonly submissionRepository: Repository<SubmissionReqDto>,
  ) {
    super(submissionRepository);
  }

  async findSubmissionsByAssigmentId(
    assignmentId: string,
  ): Promise<OperationResult<any>> {
    return await this.submissionRepository
      .find({
        where: {
          assignmentId: assignmentId,
        },
        relations: {
          user: true,
        },
      })
      .then((submissions) => {
        for (let i = 0; i < submissions.length; i++) {
          submissions[i].user = plainToInstance(
            UserResDto,
            submissions[i].user,
            {
              excludeExtraneousValues: true,
            },
          );
        }
        return OperationResult.ok({
          submissions: submissions,
          role: SubRole.TEACHER,
        });
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async findSubmissionsByAssigmentIdAndUserId(
    assignmentId: string,
    userId: string,
  ): Promise<OperationResult<any>> {
    return await this.submissionRepository
      .find({
        where: {
          assignmentId: assignmentId,
          userId: userId,
        },
        relations: {
          user: true,
        },
      })
      .then((submissions) => {
        for (let i = 0; i < submissions.length; i++) {
          submissions[i].user = plainToInstance(
            UserResDto,
            submissions[i].user,
            {
              excludeExtraneousValues: true,
            },
          );
        }

        return OperationResult.ok({
          submissions: submissions,
          role: SubRole.STUDENT,
        });
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }
}
