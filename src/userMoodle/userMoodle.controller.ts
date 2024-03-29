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
import { CourseService } from 'src/gRPc/services/course';
// import { UserService } from 'src/gRPc/services/user';
import { Observable } from 'rxjs';
import { UserRequest } from 'src/gRPc/interfaces/user/UserRequest';
import { UserService } from './userMoodle.service';

@ApiTags('User Moodle')
@Controller('/api/user-moodle')
export class UserMoodleController implements OnModuleInit {
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

  @Get('/get-user-by-email')
  async getUserByEmail(@Body() emails: string[]) {
    const result = this.userMoodleService.getUsersByEmails({ emails });
    return result;
  }

  @Get('/get-all-users')
  async getAllUsers() {
    const response$ = this.userMoodleService.getAllUsers({}).pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(
      resultDTO,
      'users',
    );
    return result;
  }

  @Get('/get-user-course')
  async getUserCourse(@Query() query: string) {
    // ban đầu nhờ client truyền id dùm, nhưng sau thì thông tin này phải lấy từ session
    const result = await firstValueFrom(
      this.courseMoodleService
        .getUsersCourse({
          userMoodleId: query['userMoodleId'],
        })
        .pipe(),
    );
    return result;
  }
}
