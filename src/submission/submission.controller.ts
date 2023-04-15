import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { SubmissionResDto } from './res/submission-res.dto';
import { SubmissionService } from './submission.service';
import { SubmissionReqDto } from './req/submission-req.dto';
const SALTROUNDS = 10;
@ApiTags('Submission')
@Controller('/api/submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post('/add-submissions')
  async addSubmissions(@Body() submissions: SubmissionReqDto[]) {
    const result = await this.submissionService.createMany(
      SubmissionResDto,
      submissions,
    );
    return result;
  }

  @Get('/get-all-submission')
  async getAllSubmissions() {
    const result = await this.submissionService.findAll(SubmissionResDto);
    return result;
  }

  @Get('/get-submission/:submissionId')
  async getSubmissionById(@Param('submissionId') submissionId: string) {
    const result = await this.submissionService.findOne(
      SubmissionResDto,
      submissionId,
    );
    return result;
  }

  @Get('/get-submissions')
  async getSubmissionsById(@Query() query: string) {
    if (query['userId']) {
      return await this.submissionService.findSubmissionsByAssigmentIdAndUserId(
        query['assignmentId'],
        query['userId'],
      );
    }
    const result = await this.submissionService.findSubmissionsByAssigmentId(
      query['assignmentId'],
    );
    return result;
  }
}
