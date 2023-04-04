import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectReqDto } from './req/project-req.dto';
import { ProjectResDto } from './res/project-res.dto';

@Injectable()
export class ProjectService extends BaseService<ProjectReqDto, ProjectResDto> {
  constructor(
    @InjectRepository(ProjectReqDto) private readonly projectRepository: Repository<ProjectReqDto>,
  ) {
    super(projectRepository);
  }

  async findProjectsByUserId(userId: string): Promise<OperationResult<Array<ProjectResDto>>> {
    var result: OperationResult<Array<ProjectResDto>>

    await this.projectRepository.createQueryBuilder("project")
      .where("project.userId = :userId and project.deletedAt is null", { userId: userId })
      .getMany()
      .then((projects) => {
        result = OperationResult.ok(plainToInstance(ProjectResDto, projects, { excludeExtraneousValues: true }))
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }

  async findProjectsByUserIdAndSubmissionIdIsNull(userId: string): Promise<OperationResult<Array<ProjectResDto>>> {
    var result: OperationResult<Array<ProjectResDto>>

    await this.projectRepository.createQueryBuilder("project")
      .where("project.userId = :userId and project.submissionId is null and project.deletedAt is null", { userId: userId })
      .getMany()
      .then((projects) => {
        result = OperationResult.ok(plainToInstance(ProjectResDto, projects, { excludeExtraneousValues: true }))
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }
}
