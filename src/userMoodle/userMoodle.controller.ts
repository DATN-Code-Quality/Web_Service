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
import { Role } from 'src/auth/auth.const';
import { Roles } from 'src/auth/auth.decorator';
import { ServiceResponse } from 'src/common/service-response';
import { GCourseService } from 'src/gRPc/services/course';
import { GUserService } from 'src/gRPc/services/user';

@ApiTags('User Moodle')
@Controller('/api/user-moodle')
export class UserMoodleController implements OnModuleInit {
  private userMoodleService: GUserService;
  private courseMoodleService: GCourseService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userMoodleService =
      this.client.getService<GUserService>('GUserService');
    this.courseMoodleService =
      this.client.getService<GCourseService>('GCourseService');
  }

  @Roles(Role.ADMIN)
  @Get('/get-user-by-email')
  async getUserByEmail(@Body() emails: string[]) {
    const response$ = this.userMoodleService.getUsersByEmails({ emails });
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(
      resultDTO,
      'users',
    );
    return result;
  }

  @Roles(Role.ADMIN)
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

  @Roles(Role.ADMIN)
  @Get('/get-user-course')
  async getUserCourse(@Query() query: { userMoodleId: number }) {
    // ban đầu nhờ client truyền id dùm, nhưng sau thì thông tin này phải lấy từ session
    const response$ = this.courseMoodleService
      .getUsersCourse({
        userMoodleId: query['userMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(
      resultDTO,
      'users',
    );
    return result;
  }
}
