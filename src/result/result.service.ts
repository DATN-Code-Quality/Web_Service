import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultReqDto } from './req/result-req.dto';
import { ResultResDto } from './res/result-res.dto';
import { GSonarqubeService } from 'src/gRPc/services/sonarqube';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ResultService extends BaseService<ResultReqDto, ResultResDto> {
  private clientService: GSonarqubeService;

  onModuleInit() {
    this.clientService =
      this.client.getService<GSonarqubeService>('GSonarqubeService');
  }

  constructor(
    @InjectRepository(ResultReqDto)
    private readonly resultRepository: Repository<ResultReqDto>,
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
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

  async getAvgResults() {
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

  async getTopIssue(submissionIds: string[], isDesc: boolean, limit: number) {
    const ruleMap = new Map<string, number>([]);
    let sortedNumDesc: Map<string, number>;
    const result = [];
    const results = await this.getResultsBySubmissionIds(submissionIds);
    if (results.length > 0) {
      results.forEach((result) => {
        const ruleStrs = result.rules.slice(1, -1).split(', ');
        ruleStrs.forEach((rule) => {
          const item = rule.split('=');
          if (ruleMap.has(item[0])) {
            ruleMap.set(item[0], ruleMap.get(item[0]) + Number(item[1]));
          } else {
            ruleMap.set(item[0], Number(item[1]));
          }
        });
      });
    }

    if (isDesc) {
      sortedNumDesc = new Map([...ruleMap].sort((a, b) => b[1] - a[1]));
    } else {
      sortedNumDesc = new Map([...ruleMap].sort((a, b) => a[1] - b[1]));
    }

    let len = limit > sortedNumDesc.size ? sortedNumDesc.size : limit;
    for (let [key, value] of sortedNumDesc) {
      // console.log(key, value);

      const rule = await firstValueFrom(
        await this.clientService.getRuleDetailByKey({
          key: key,
        }),
      );

      if (rule.error == 0) {
        result.push({
          rule: rule.data,
          count: value,
        });
      }

      len--;
      if (len <= 0) {
        break;
      }
    }
    return OperationResult.ok(result);
  }
}
