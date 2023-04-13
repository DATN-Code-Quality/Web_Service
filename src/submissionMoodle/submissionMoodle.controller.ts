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
import { CourseService } from 'src/gRPc/services/course';
import { SubmissionService } from 'src/gRPc/services/submission';
import { UserService } from 'src/gRPc/services/user';

@ApiTags('Submission Moodle')
@Controller('/api/submission-moodle')
export class SubmissionMoodleController implements OnModuleInit {
  private userMoodleService: UserService;
  private courseMoodleService: CourseService;
  private submissionService: SubmissionService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userMoodleService = this.client.getService<UserService>('UserService');
    this.courseMoodleService =
      this.client.getService<CourseService>('CourseService');
    this.submissionService =
      this.client.getService<SubmissionService>('SubmissionService');
  }

  @Get('/get-submissions-by-assignment-id')
  async getSubmissionsByAssignmentId(@Query() query: string) {
    const result = this.submissionService.getSubmissionsByAssignmentId({
      assignmentMoodleId: query['assignmentMoodleId'],
    });
    return result;
  }
}
