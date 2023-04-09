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
import { UserService } from 'src/gRPc/services/user';

@ApiTags('Submission Moodle')
@Controller('/api/submission-moodle')
export class SubmissionMoodleController implements OnModuleInit {
  private userMoodleService: UserService;
  private courseMoodleService: CourseService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userMoodleService = this.client.getService<UserService>('UserService');
    this.courseMoodleService =
      this.client.getService<CourseService>('CourseService');
  }

  // @Get('/get-user-by-email')
  // async getUserByEmail(@Body() emails: string[]) {
  //   const result = this.userMoodleService.getUsersByEmails({ emails });
  //   return result;
  // }
}
