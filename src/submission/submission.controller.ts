import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionResDto } from './res/submission-res.dto';
import { SubmissionService } from './submission.service';
import { SubmissionReqDto } from './req/submission-req.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { GSubmissionService } from 'src/gRPc/services/submission';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/common/service-response';
import { Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';
@ApiTags('Submission')
@Controller('/api/submission')
export class SubmissionController implements OnModuleInit {
  private gSubmissionService: GSubmissionService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
    private readonly submissionService: SubmissionService,
  ) {}
  onModuleInit() {
    this.gSubmissionService =
      this.client.getService<GSubmissionService>('GSubmissionService');
  }

  @SubRoles(SubRole.STUDENT)
  @Post('/submissions')
  async addSubmissions(
    @Body(new ParseArrayPipe({ items: SubmissionReqDto }))
    submissions: SubmissionReqDto[],
  ) {
    const result = await this.submissionService.createMany(
      SubmissionResDto,
      submissions,
    );
    return result;
  }

  @Roles(Role.USER)
  @Get('/submissions')
  async getAllSubmissions() {
    const result = await this.submissionService.findAll(SubmissionResDto);
    return result;
  }

  @Roles(Role.USER)
  @Get('/:submissionId')
  async getSubmissionById(@Param('submissionId') submissionId: string) {
    const result = await this.submissionService.findOne(
      SubmissionResDto,
      submissionId,
    );
    return result;
  }

  @Roles(Role.USER)
  @Get('')
  async getSubmissionsById(@Query() query: string) {
    if (query['userId']) {
      return await this.submissionService.findSubmissionsByAssigmentIdAndUserId(
        query['assignmentId'],
        query['userId'],
      );
    }
    console.log(query['assignmentId'], query['userId']);
    const result = await this.submissionService.findSubmissionsByAssigmentId(
      query['assignmentId'],
    );
    return result;
  }

  //Moodle:
  @SubRoles(SubRole.TEACHER)
  @Get('/sync-submissions-by-assignment-id')
  async getSubmissionsByAssignmentId(@Query() query: string) {
    const response$ = this.gSubmissionService
      .getSubmissionsByAssignmentId({
        assignmentMoodleId: query['assignmentMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const data = resultDTO.data.map((submission) => ({
      ...submission,
      timemodified: new Date(parseInt(submission.timemodified, 10) * 1000),
    }));
    const newResultDTO = {
      ...resultDTO,
      data,
    };
    const result = ServiceResponse.resultFromServiceResponse(
      newResultDTO,
      'data',
    );
    return result;
  }
}
