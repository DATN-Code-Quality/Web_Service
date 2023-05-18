import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  DefaultValuePipe,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CourseResDto } from './res/course-res.dto';
import { CourseReqDto } from './req/course-req.dto';
import { ServiceResponse } from 'src/common/service-response';
import { GCourseService } from 'src/gRPc/services/course';
import { GCategoryService } from 'src/gRPc/services/category';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';
import { UserCourseService } from 'src/user-course/user-course.service';
import { UserService } from 'src/user/user.service';
import { OperationResult } from 'src/common/operation-result';
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
    // const result = await this.courseService.createMany(CourseResDto, courses);
    const result = await this.courseService.upsertCourses(courses);

    result.data.map(async (course) => {
      const users = (
        await this.userCourseService.getUsersByCourseMoodleId(
          parseInt(course.courseMoodleId),
        )
      ).data;
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
      this.userCourseService.addUsersIntoCourse(
        course.id,
        teacherIds,
        studentIds,
      );
    });
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/all-courses')
  async getAllCourses(
    @Query('categoryId', new DefaultValuePipe(null)) categoryId: string,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('startAt', new DefaultValuePipe(null)) startAt: Date,
    @Query('endAt', new DefaultValuePipe(null)) endAt: Date,
  ) {
    const result = await this.courseService.findAllCourses(
      categoryId,
      name,
      startAt,
      endAt,
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

  // @Roles(Role.ADMIN, Role.USER)
  @SubRoles(SubRole.ADMIN, SubRole.STUDENT, SubRole.TEACHER)
  @Get('/:courseId')
  async getCourseById(@Param('courseId') courseId: string, @Request() req) {
    const result = await this.courseService.findOne(CourseResDto, courseId);
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
}
