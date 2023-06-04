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
import { USER_STATUS } from 'src/user/req/user-req.dto';

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
    @Query('role', new DefaultValuePipe(null)) role: string,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('status', new DefaultValuePipe(null)) status: USER_STATUS,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
    @Request() req,
  ) {
    const result = await this.userCourseService.findUsersByCourseId(
      courseId,
      role,
      search,
      status,
      limit,
      offset,
    );
    if (result.isOk()) {
      return OperationResult.ok({
        total: result.data['total'],
        users: result.data['users'],
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.ADMIN)
  @Get('/:courseId/user-not-in-course')
  async getUserNotInCourse(
    @Param('courseId') courseId: string,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('status', new DefaultValuePipe(null)) status: USER_STATUS,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
  ) {
    return this.userCourseService.getUserNotInCourse(
      courseId,
      search,
      status,
      limit,
      offset,
    );
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
    // 6 is error in third party with no participant in this course
    if (resultDTO?.error == 6) {
      resultDTO.error = 0;
      resultDTO.data = [];
    }
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/:userId/courses')
  async getAllCoursesByUserId(
    @Param('userId') userId: string,
    @Query('role', new DefaultValuePipe(null)) role: string,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('startAt', new DefaultValuePipe('')) startAt: Date,
    @Query('endAt', new DefaultValuePipe('')) endAt: Date,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
  ) {
    const result = await this.userCourseService.findCoursesByUserId(
      userId,
      role,
      name,
      startAt,
      endAt,
      limit,
      offset,
    );
    return result;
  }

  @SubRoles(SubRole.ADMIN)
  @Delete('/:userId/courses')
  async deleteUserInCourse(@Param('userId') userId: string) {
    const result = await this.userCourseService.deleteUserInCourse(userId);
    return result;
  }
  @SubRoles(SubRole.ADMIN)
  @Put('/:userId/courses')
  async updateRoleUser(
    @Param('userId') userId: string,
    @Query('role', new DefaultValuePipe(null)) role: SubRole,
  ) {
    const result = await this.userCourseService.deleteUserInCourse(userId);
    return result;
  }

  @Roles(Role.USER)
  @Get('/courses-of-user')
  async getAllCoursesOfUser(
    @Request() req,
    @Query('role', new DefaultValuePipe(null)) role: string,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('startAt', new DefaultValuePipe(null)) startAt: Date,
    @Query('endAt', new DefaultValuePipe(null)) endAt: Date,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
  ) {
    const userId = req.headers['userId'];
    const result = await this.userCourseService.findCoursesByUserId(
      userId,
      role,
      search,
      startAt,
      endAt,
      limit,
      offset,
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
    const studentRoleIds =
      data['studentRoleIds'] == null ? [] : data['studentRoleIds'];
    const teacherRoleIds =
      data['teacherRoleIds'] == null ? [] : data['teacherRoleIds'];
    if (studentRoleIds.length !== 0 || teacherRoleIds.length != 0) {
      const result = await this.userCourseService.addUsersIntoCourse(
        courseId,
        studentRoleIds,
        teacherRoleIds,
      );
      return result;
    } else {
      return OperationResult.ok('No user has been added in to course');
    }
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
    if (!userDto) return;
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
    // this.userCourseService.addUsersIntoCourse(courseId, teacherIds, studentIds);
    const result = await this.userCourseService.addUsersIntoCourse(
      courseId,
      studentIds,
      teacherIds,
    );
    return result;
  }

  @SubRoles(SubRole.ADMIN)
  @Put('/:courseId/:userId')
  async changeRole(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Body() data: object,
  ) {
    const role = data['role'];
    if (role !== SubRole.STUDENT && role !== SubRole.TEACHER) {
      return OperationResult.error(new Error('Invalid role'));
    }

    return this.userCourseService.changeRole(courseId, userId, role);
  }

  @SubRoles(SubRole.ADMIN)
  @Delete('/:courseId')
  async removeUser(@Param('courseId') courseId: string, @Body() data: object) {
    const userIds = data['userIds'];
    if (userIds && typeof userIds === typeof [] && userIds.length > 0) {
      return this.userCourseService.removeUsers(courseId, userIds);
    } else {
      return OperationResult.error(
        new Error("field 'userIds' has to array of string"),
      );
    }
  }
}
