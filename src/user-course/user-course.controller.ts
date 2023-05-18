import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Post,
  Query,
  DefaultValuePipe,
  Put,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { ApiTags } from '@nestjs/swagger';
import { UserCourseResDto } from './res/user-course-res.dto';
import { Public, Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';
import { UserCourseReqDto } from './req/user-course-req.dto';
import { GUserService } from 'src/gRPc/services/user';
import { ClientGrpc } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/common/service-response';
import { User } from 'src/gRPc/interfaces/User';
import { CourseService } from 'src/course/course.service';
import { CourseResDto } from 'src/course/res/course-res.dto';
import { OperationResult } from 'src/common/operation-result';

@ApiTags('UserCourse')
@Controller('/api/user-course')
export class UserCourseController {
  private gUserMoodleService: GUserService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
    private readonly userCourseService: UserCourseService,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.gUserMoodleService =
      this.client.getService<GUserService>('GUserService');
  }

  // @Roles(Role.USER, Role.ADMIN)
  // @Get('/get-all-user-course')
  // async getAllUsers() {
  //   const result = await this.userCourseService.findAll(UserCourseResDto);
  //   return result;
  // }
  // @Roles(Role.ADMIN, Role.USER)
  @SubRoles(SubRole.STUDENT, SubRole.TEACHER, SubRole.ADMIN)
  @Get('/:courseId/users')
  async getAllUsersByCourseId(
    @Param('courseId') courseId: string,
    // @Query('name', new DefaultValuePipe('')) name: string,
    // @Query('userId', new DefaultValuePipe('')) userId: string,
    @Query('role', new DefaultValuePipe(null)) role: string,
    @Request() req,
  ) {
    const result = await this.userCourseService.findUsersByCourseId(
      courseId,
      role,
    );
    if (result.isOk()) {
      return OperationResult.ok({
        users: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('/sync-users')
  async getUsersByCourseMoodleId(@Query() query: string) {
    const response$ = this.gUserMoodleService
      .getUsersByCourseMoodleId({
        courseMoodleId: query['courseMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }

  // @Roles(Role.ADMIN, Role.USER)
  @Roles(Role.ADMIN)
  @Get('/:userId/courses')
  async getAllCoursesByUserId(
    @Param('userId') userId: string,
    @Query('role', new DefaultValuePipe(null)) role: string,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('startAt', new DefaultValuePipe('')) startAt: Date,
    @Query('endAt', new DefaultValuePipe('')) endAt: Date,
  ) {
    const result = await this.userCourseService.findCoursesByUserId(
      userId,
      role,
      name,
      startAt,
      endAt,
    );
    return result;
  }

  @Roles(Role.USER)
  @Get('/courses-of-user')
  async getAllCoursesOfUser(
    @Request() req,
    @Query('role', new DefaultValuePipe(null)) role: string,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('startAt', new DefaultValuePipe(null)) startAt: Date,
    @Query('endAt', new DefaultValuePipe(null)) endAt: Date,
  ) {
    const userId = req.headers['userId'];
    const result = await this.userCourseService.findCoursesByUserId(
      userId,
      role,
      name,
      startAt,
      endAt,
    );
    return result;
  }

  @Roles(Role.ADMIN)
  @Post('/:courseId/system')
  async addUsersIntoCourse(
    @Param('courseId') courseId: string,
    @Body() data: any,
    // @Body() teacherRoleIds: string[],
  ) {
    const result = await this.userCourseService.addUsersIntoCourse(
      courseId,
      data['studentRoleIds'],
      data['teacherRoleIds'],
    );
    return result;
  }

  @SubRoles(SubRole.TEACHER, SubRole.ADMIN)
  @Post('/:courseId/moodle')
  async addUsersIntoCourseByMoodle(
    @Param('courseId') courseId: string,
    @Body() users: User[],
  ) {
    // const courseDetail = (
    //   await this.courseService.findOne(CourseResDto, courseId)
    // ).data;
    // const users = (
    //   await this.userCourseService.getUsersByCourseMoodleId(
    //     parseInt(courseDetail.courseMoodleId),
    //   )
    // ).data;
    const copyUsers = JSON.parse(JSON.stringify(users));
    const newUsers = await this.userService.upsertUsers(users);
    const userDto = newUsers.data as any;
    const teacherIds = userDto
      .filter((user) => {
        const role = copyUsers.find(
          (userRole) => userRole.moodleId === user.moodleId,
        ).role;
        if (role == SubRole.TEACHER) {
          return user;
        }
      })
      .map((user) => user.id);
    const studentIds = userDto
      .filter((user) => {
        const role = copyUsers.find(
          (userRole) => userRole.moodleId === user.moodleId,
        ).role;
        if (role == SubRole.STUDENT) {
          return user;
        }
      })
      .map((user) => user.id);
    this.userCourseService.addUsersIntoCourse(courseId, teacherIds, studentIds);
    const result = await this.userCourseService.addUsersIntoCourse(
      courseId,
      teacherIds,
      studentIds,
    );
    return result;
  }
}
