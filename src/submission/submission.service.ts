import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { SubmissionReqDto } from './req/submission-req.dto';
import { SubmissionResDto } from './res/submission-res.dto';
import { OperationResult } from 'src/common/operation-result';

@Injectable()
export class SubmissionService extends BaseService<SubmissionReqDto, SubmissionResDto>{
  constructor(
    @InjectRepository(SubmissionReqDto) private readonly submissionRepository: Repository<SubmissionReqDto>
  ) {
    super(submissionRepository)
  }

  async findSubmissionsByAssigmentId(assignmentId: string): Promise<OperationResult<Array<SubmissionResDto>>> {
    var result: OperationResult<Array<SubmissionResDto>>
    await this.submissionRepository.createQueryBuilder('submission')
      .where("submission.assignmentId = :assignmentId and submission.deletedAt is null", { assignmentId: assignmentId })
      .getMany()
      .then((submissions) => {
        result = OperationResult.ok(plainToInstance(SubmissionResDto, submissions, { excludeExtraneousValues: true }))
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }

  async findSubmissionsByAssigmentIdAndUserId(assignmentId: string, userId: string): Promise<OperationResult<Array<SubmissionResDto>>> {
    var result: OperationResult<Array<SubmissionResDto>>
    await this.submissionRepository.createQueryBuilder('submission')
      .where("submission.assignmentId = :assignmentId and submission.userId = :userId and submission.deletedAt is null", { assignmentId: assignmentId, userId: userId })
      .getMany()
      .then((submissions) => {
        result = OperationResult.ok(plainToInstance(SubmissionResDto, submissions, { excludeExtraneousValues: true }))
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }
}
