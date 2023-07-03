import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
import { ResultService } from './result.service';
@ApiTags('Result')
@Controller('/api/result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Roles(Role.USER)
  @Get('/:courseId/:assignmentId/:submissionId')
  async getResultsBySubmissionId(
    @Param('submissionId') submissionId: string,
    // @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    // @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ) {
    return await this.resultService.getResultBySubmissionId(submissionId);
  }
}
