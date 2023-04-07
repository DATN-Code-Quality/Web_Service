import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { SubmissionResDto } from './res/submission-res.dto';
import { SubmissionService } from './submission.service';
const SALTROUNDS = 10;
@ApiTags('Submission')
@Controller('/api/submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('/get-all-submission')
  async getAllSubmissions() {
    const result = await this.submissionService.findAll(SubmissionResDto);
    return result;
  }
}
