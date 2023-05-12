import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { SUBMISSION_STATUS, SubmissionReqDto } from './req/submission-req.dto';
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

  async removeSubmission(submissionId: string) {
    return this.remove(submissionId);
  }

  async upsertSubmission(
    submission: SubmissionResDto,
  ): Promise<OperationResult<SubmissionResDto>> {
    return await this.submissionRepository
      .createQueryBuilder('submission')
      .withDeleted()
      .where(
        'submission.assignmentId = :assignmentId and submission.userId = :userId',
        {
          assignmentId: submission.assignmentId,
          userId: submission.userId,
        },
      )
      .getOne()
      .then(async (savedSubmission) => {
        if (savedSubmission) {
          submission.deletedAt = null;
          await this.submissionRepository.update(
            savedSubmission.id,
            submission,
          );
          savedSubmission = await this.submissionRepository.findOneBy({
            id: savedSubmission.id,
          });
        } else {
          savedSubmission = await this.submissionRepository.save(submission);
        }

        return OperationResult.ok(savedSubmission);
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async countSubmissionByAssignmentIdAndGroupByStatus(
    assignmentId: string,
  ): Promise<any> {
    const status = await this.submissionRepository
      .createQueryBuilder('submission')
      .groupBy('submission.status')
      .where('submission.assignmentId = :assignmentId', {
        assignmentId: assignmentId,
      })
      .select('submission.status, COUNT(*) AS numberOfSubmission')
      .execute();
    const result = {};
    status.forEach((item) => {
      result[item['status']] = parseInt(item['numberOfSubmission']);
    });

    return {
      waitToScan: result[`${SUBMISSION_STATUS.SUBMITTED}`],
      scanning: result[`${SUBMISSION_STATUS.SCANNING}`],
      scanSuccess: {
        pass: result[`${SUBMISSION_STATUS.PASS}`],
        fail: result[`${SUBMISSION_STATUS.FAIL}`],
      },
      scanFail: result[`${SUBMISSION_STATUS.SCANNED_FAIL}`],
    };
  }
}
