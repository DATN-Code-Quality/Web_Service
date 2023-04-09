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
import { query } from 'express';
import { firstValueFrom } from 'rxjs';
import { AssignmentService } from 'src/gRPc/services/assignment';
import { CourseService } from 'src/gRPc/services/course';
import { UserService } from 'src/gRPc/services/user';

@ApiTags('Assignment Moodle')
@Controller('/api/assignment-moodle')
export class AssignmentMoodleController implements OnModuleInit {
  private userMoodleService: UserService;
  private courseMoodleService: CourseService;
  private assignmentService: AssignmentService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userMoodleService = this.client.getService<UserService>('UserService');
    this.courseMoodleService =
      this.client.getService<CourseService>('CourseService');
    this.assignmentService =
      this.client.getService<AssignmentService>('AssignmentService');
  }

  @Get('/get-assignments-by-course-id')
  async getUserByEmail(@Query() query: string) {
    const result = this.assignmentService.getAllAssignmentsByCourseId({
      courseMoodleId: query['courseMoodleId'],
    });
    return result;
  }
}
