import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultService } from 'src/result/result.service';

@Injectable()
export class FacultyService {
  //   constructor(private readonly resultService: Repository<ResultService>) {}
}
