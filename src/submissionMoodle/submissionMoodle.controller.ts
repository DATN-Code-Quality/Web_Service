import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/common/service-response';
import { GSubmissionService } from 'src/gRPc/services/submission';

@ApiTags('Submission Moodle')
@Controller('/api/submission-moodle')
export class SubmissionMoodleController implements OnModuleInit {
  private submissionService: GSubmissionService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.submissionService =
      this.client.getService<GSubmissionService>('GSubmissionService');
  }

  @Get('/get-submissions-by-assignment-id')
  async getSubmissionsByAssignmentId(@Query() query: string) {
    const response$ = this.submissionService
      .getSubmissionsByAssignmentId({
        assignmentMoodleId: query['assignmentMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const submissions = resultDTO.data.map((submission) => ({
      ...submission,
      timemodified: new Date(parseInt(submission.timemodified, 10) * 1000),
    }));
    const newResultDTO = {
      ...resultDTO,
      submissions,
    };
    const result = ServiceResponse.resultFromServiceResponse(
      newResultDTO,
      'submissions',
    );
    return result;
  }
}
