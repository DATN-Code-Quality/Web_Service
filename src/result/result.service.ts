import { Injectable } from '@nestjs/common';
import { ResultReqDto } from './req/result-req.dto';
import { BaseService } from 'src/common/base.service';
import { ResultResDto } from './res/result-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResultService extends BaseService<ResultReqDto, ResultResDto>{
  constructor(
    @InjectRepository(ResultReqDto) private readonly resultRepository: Repository<ResultReqDto>
  ) {
    super(resultRepository)
  }

  async findResultsByProjectId(projectId: string): Promise<OperationResult<Array<ResultResDto>>> {
    var result: OperationResult<Array<ResultResDto>>

    await this.resultRepository.createQueryBuilder("result")
      .where("result.projectId = :projectId and result.deletedAt is null", { projectId: projectId })
      .getMany()
      .then((results) => {
        result = OperationResult.ok(plainToInstance(ResultResDto, results, { excludeExtraneousValues: true }))
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }
}
