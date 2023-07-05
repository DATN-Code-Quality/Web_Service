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

export const RULEMAP = new Map<string, string[]>([
  ['c', ['c', 'common-c']],
  ['cpp', ['common-cpp', 'cpp']],
  ['cs', ['common-cs', 'csharpsquid', 'roslyn.sonaranalyzer.security.cs']],
  ['objc', ['common-objc', 'objc']],
  [
    'py',
    [
      'common-py',
      'external_bandit',
      'external_flake8',
      'external_mypy',
      'external_pylint',
      'python',
      'pythonbugs',
      'pythonsecurity',
    ],
  ],
  ['js', ['common-js', 'external_eslint_repo', 'javascript', 'jssecurity']],
  ['ts', ['common-ts', 'external_tslint_repo', 'tssecurity', 'typescript']],
  ['css', ['css', 'external_stylelint']],
  ['xml', ['xml']],
  ['go', ['common-go', 'external_golint', 'external_govet', 'go']],
  [
    'java',
    [
      'common-java',
      'external_checkstyle',
      'external_fbcontrib',
      'external_findsecbugs',
      'external_pmd',
      'external_spotbugs',
      'java',
      'javabugs',
      'javasecurity',
    ],
  ],
  [
    'kotlin',
    [
      'common-kotlin',
      'external_android-lint',
      'external_detekt',
      'external_ktlint',
      'kotlin',
    ],
  ],
  [
    'php',
    ['common-php', 'external_phpstan', 'external_psalm', 'php', 'phpsecurity'],
  ],
  ['ruby', ['common-ruby', 'external_rubocop', 'ruby']],
]);

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

  async getTopIssue(submissionIds: string[], language: string, limit: number) {
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
    sortedNumDesc = new Map([...ruleMap].sort((a, b) => b[1] - a[1]));

    const [firstKey] = sortedNumDesc.keys();
    const maxLang = this.getByValue(RULEMAP, firstKey.split(':')[0]);
    const lang = language && RULEMAP.has(language) ? language : maxLang;
    let len = limit > sortedNumDesc.size ? sortedNumDesc.size : limit;

    for (let [key, value] of sortedNumDesc) {
      if (RULEMAP.get(lang).indexOf(key.split(':')[0]) != -1) {
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
        } else {
          return OperationResult.error(new Error(rule.message));
        }

        len--;
        if (len <= 0) {
          break;
        }
      }
    }

    return OperationResult.ok({
      issues: {
        language: lang,
        rules: result,
      },
      languages: this.getLanguage(sortedNumDesc),
    });
  }

  getByValue(map: Map<string, string[]>, searchValue: string): string {
    for (let [key, value] of map.entries()) {
      if (value.indexOf(searchValue) != -1) {
        return key;
      }
    }
    return null;
  }

  getLanguage(map: Map<string, any>): String[] {
    const keySet = new Set<string>();
    for (let [key, value] of map) {
      keySet.add(key.split(':')[0]);
    }
    const langSet = new Set<string>();
    keySet.forEach((key) => {
      const lang = this.getByValue(RULEMAP, key);
      if (lang) {
        langSet.add(lang);
      }
    });

    return Array.from(langSet.values());
  }
}
