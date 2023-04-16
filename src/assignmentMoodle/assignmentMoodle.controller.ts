import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Query
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/common/service-response';
import { GAssignmentService } from 'src/gRPc/services/assignment';
import { CourseService } from 'src/gRPc/services/course';
import { UserService } from 'src/gRPc/services/user';

@ApiTags('Assignment Moodle')
@Controller('/api/assignment-moodle')
export class AssignmentMoodleController implements OnModuleInit {
  private userMoodleService: UserService;
  private courseMoodleService: CourseService;
  private assignmentService: GAssignmentService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userMoodleService = this.client.getService<UserService>('UserService');
    this.courseMoodleService =
      this.client.getService<CourseService>('CourseService');
    this.assignmentService =
      this.client.getService<GAssignmentService>('AssignmentService');
  }

  @Get('/get-assignments-by-course-id')
  async getUserByEmail(@Query() query: string) {
    const response$ = this.assignmentService
      .getAllAssignmentsByCourseId({
        courseMoodleId: query['courseMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(
      resultDTO,
      'assignments',
    );
    return result;
  }
}
