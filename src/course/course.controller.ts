import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  Request,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Role, SubRole } from 'src/auth/auth.const';
import { Roles, SubRoles } from 'src/auth/auth.decorator';
import { OperationResult } from 'src/common/operation-result';
import { ServiceResponse } from 'src/common/service-response';
import { CourseCronjobRequest } from 'src/gRPc/interfaces/Course';
import { GCategoryService } from 'src/gRPc/services/category';
import { GCourseService } from 'src/gRPc/services/course';
import { UserCourseService } from 'src/user-course/user-course.service';
import { UserService } from 'src/user/user.service';
import { CourseService } from './course.service';
import { CourseReqDto } from './req/course-req.dto';
import { CourseResDto } from './res/course-res.dto';
@ApiTags('Course')
@Controller('/api/course')
export class CourseController implements OnModuleInit {
  private gCourseMoodleService: GCourseService;
  private gCategoryMoodleService: GCategoryService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    private readonly userCourseService: UserCourseService,
  ) {}
  onModuleInit() {
    this.gCourseMoodleService =
      this.client.getService<GCourseService>('GCourseService');
    this.gCategoryMoodleService =
      this.client.getService<GCategoryService>('GCategoryService');
  }

  @Roles(Role.ADMIN)
  @Post('/')
  async addCourses(
    @Body(new ParseArrayPipe({ items: CourseReqDto }))
    courses: CourseReqDto[],
  ) {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].startAt > courses[i].endAt) {
        return OperationResult.error(new Error('startAt must be before endAt'));
      }
    }
    // const result = await this.courseService.createMany(CourseResDto, courses);
    const result = await this.courseService.upsertCourses(courses);
    const a = result.data.map((course, index) => {
      if (course.courseMoodleId) {
        const asyncFunc = async () => {
          const cronJobData: CourseCronjobRequest = {
            id: course.id,
            courseMoodleId: course.courseMoodleId,
            endAt: course.endAt,
          };

          const users = (
            await this.userCourseService.getUsersByCourseMoodleId(
              parseInt(course.courseMoodleId),
            )
          ).data;
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
          await this.userCourseService.addUsersIntoCourse(
            course.id,
            studentIds,
            teacherIds,
          );
        };
        return asyncFunc;
      }
    });

    for await (const item of a) {
      if (item) {
        await item();
      }
    }

    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/all-courses')
  async getAllCourses(
    @Query('categoryId', new DefaultValuePipe(null)) categoryId: string,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('startAt', new DefaultValuePipe(null)) startAt: Date,
    @Query('endAt', new DefaultValuePipe(null)) endAt: Date,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
  ) {
    const result = await this.courseService.findAllCourses(
      categoryId,
      search,
      startAt,
      endAt,
      limit,
      offset,
    );
    return result;
  }

  //Moodle:
  @Roles(Role.ADMIN)
  @Get('/sync-courses')
  async getAllMoodleCourses() {
    const response$ = this.gCourseMoodleService.getAllCourses({}).pipe();
    const resultDTO = await firstValueFrom(response$);
    const data = resultDTO.data.map((course) => ({
      ...course,
      startAt: new Date(parseInt(course.startAt, 10) * 1000),
      endAt: new Date(parseInt(course.endAt, 10) * 1000),
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

  @Roles(Role.ADMIN)
  @Get('/sync-categories')
  async getAllCategories() {
    const response$ = this.gCategoryMoodleService.getAllCategories({}).pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/sync-courses-by-category')
  async getCoursesByCategory(@Query() query: string) {
    const response$ = this.gCourseMoodleService
      .getCoursesByCategory({
        categoryMoodleId: query['categoryMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const data = resultDTO.data.map((course) => ({
      ...course,
      startAt: new Date(parseInt(course.startAt, 10) * 1000),
      endAt: new Date(parseInt(course.endAt, 10) * 1000),
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

  @Roles(Role.ADMIN)
  @Get('/sync-courses-detail-by-course-moodle-id')
  async getCourseDetailByMoodleId(@Query() query: string) {
    const response$ = this.gCourseMoodleService
      .getCoursesByMoodleId({
        courseMoodleId: query['courseMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const data = resultDTO.data.map((course) => ({
      ...course,
      startAt: new Date(parseInt(course.startAt, 10) * 1000),
      endAt: new Date(parseInt(course.endAt, 10) * 1000),
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

  // @Roles(Role.ADMIN)
  // @Put('/:courseId')
  // async updateCourse(
  //   @Param('courseId') courseId: string,
  //   @Body() course: CourseReqDto,
  // ) {
  //   const {updateCourse, id }= {...course};
  //   const result = await this.courseService.update(courseId, course);
  //   return result;
  // }

  // @Roles(Role.ADMIN, Role.USER)
  @SubRoles(SubRole.ADMIN, SubRole.STUDENT, SubRole.TEACHER)
  @Get('/:courseId')
  async getCourseById(@Param('courseId') courseId: string, @Request() req) {
    Logger.log('getCourseById: Input - courseId: ' + JSON.stringify(courseId));

    const result = await this.courseService.findOne(CourseResDto, courseId);
    Logger.log('getCourseById: Result: ' + JSON.stringify(result));

    if (result.isOk()) {
      return OperationResult.ok({
        course: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/:courseId/report')
  async getReport(@Param('courseId') courseId: string, @Request() req) {
    const result = await this.courseService.getReport(courseId);
    if (result.isOk()) {
      return OperationResult.ok({
        report: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  // @Roles(Role.ADMIN)
  // @Post('/import')
  // async importuser(@Body() courses: CourseReqDto[]) {
  //   return this.courseService.upsertCourses(courses);
  // }

  @SubRoles(SubRole.TEACHER)
  @Get('/:courseId/result')
  async getResultInCourse(@Param('courseId') courseId: string, @Request() req) {
    const result = await this.courseService.getAvgResultInCourse(courseId);
    if (result.isOk()) {
      return OperationResult.ok({
        result: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/:courseId/user-result')
  async getResult(
    @Param('courseId') courseId: string,
    @Request() req,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('userName', new DefaultValuePipe('')) userName: string,
    @Query('email', new DefaultValuePipe('')) email: string,
  ) {
    const result = await this.courseService.getAvgUserResultInCourse(
      courseId,
      name,
      userName,
      email,
    );
    if (result.isOk()) {
      return OperationResult.ok({
        results: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/:courseId/:userId/assignment-result')
  async getAssignmentResult(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    const result = await this.courseService.getAssignmentResultInCourse(
      courseId,
      userId,
    );
    if (result.isOk()) {
      return OperationResult.ok({
        results: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }
}
