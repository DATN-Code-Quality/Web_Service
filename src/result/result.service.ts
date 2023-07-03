import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultReqDto } from './req/result-req.dto';
import { ResultResDto } from './res/result-res.dto';

@Injectable()
export class ResultService extends BaseService<ResultReqDto, ResultResDto> {
  constructor(
    @InjectRepository(ResultReqDto)
    private readonly resultRepository: Repository<ResultReqDto>,
  ) {
    super(resultRepository);
  }

  async getAvgResultsBySubmissionIds(submissionIds: string[]) {
    return this.resultRepository
      .createQueryBuilder('result')
      .select('ROUND(AVG(result.total), 0)', 'violations')
      .addSelect('ROUND(AVG(result.codeSmell), 0)', 'code_smells')
      .addSelect('ROUND(AVG(result.bug), 0)', 'bugs')
      .addSelect('ROUND(AVG(result.vulnerabilities), 0)', 'vulnerabilities')
      .addSelect('ROUND(AVG(result.blocker), 0)', 'blocker_violations')
      .addSelect('ROUND(AVG(result.critical), 0)', 'critical_violations')
      .addSelect('ROUND(AVG(result.major), 0)', 'major_violations')
      .addSelect('ROUND(AVG(result.minor), 0)', 'minor_violations')
      .addSelect('ROUND(AVG(result.info), 0)', 'info_violations')
      .addSelect(
        'ROUND(AVG(duplicatedLinesDensity), 2)',
        'duplicated_lines_density',
      )
      .addSelect('ROUND(AVG(coverage), 2)', 'coverage')

      .where(
        'result.submissionId IN (:...submissionIds) and result.deletedAt is null',
        {
          submissionIds: submissionIds,
        },
      )
      .getRawOne()
      .then((result) => {
        return OperationResult.ok(result);
      })
      .catch((e) => {
        return OperationResult.error(new Error(e));
      });
  }

  async getResultBySubmissionId(submissionId: string) {
    return (
      this.resultRepository
        .createQueryBuilder('result')
        // .select('ROUND(AVG(result.total), 0)', 'total')
        // .addSelect('ROUND(AVG(result.codeSmell), 0)', 'codeSmell')
        // .addSelect('ROUND(AVG(result.bug), 0)', 'bug')
        // .addSelect('ROUND(AVG(result.vulnerabilities), 0)', 'vulnerabilities')
        // .addSelect('ROUND(AVG(result.blocker), 0)', 'blocker')
        // .addSelect('ROUND(AVG(result.critical), 0)', 'critical')
        // .addSelect('ROUND(AVG(result.major), 0)', 'major')
        // .addSelect('ROUND(AVG(result.info), 0)', 'info')
        // .addSelect('ROUND(AVG(result.minor), 0)', 'minor')
        // .addSelect(
        //   'ROUND(AVG(duplicatedLinesDensity), 2)',
        //   'duplicatedLinesDensity',
        // )
        // .addSelect('ROUND(AVG(coverage), 2)', 'coverage')

        .where(
          'result.submissionId = :submissionId and result.deletedAt is null',
          {
            submissionId: submissionId,
          },
        )
        .getOne()
        .then((result) => {
          return OperationResult.ok(result);
        })
        .catch((e) => {
          return OperationResult.error(new Error(e));
        })
    );
  }

  async getResultsBySubmissionIds(submissionIds: string[]) {
    return await this.resultRepository.find({
      where: {
        submissionId: In(submissionIds),
      },
    });
  }
}
