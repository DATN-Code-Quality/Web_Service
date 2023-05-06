import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
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
@ApiTags('Course')
@Controller('/api/course')
export class CourseController implements OnModuleInit {
  private gCourseMoodleService: GCourseService;
  private gCategoryMoodleService: GCategoryService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
    private readonly courseService: CourseService,
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
    const result = await this.courseService.createMany(CourseResDto, courses);
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/courses')
  async getAllCourses() {
    const result = await this.courseService.findAll(CourseResDto);
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

  @Roles(Role.ADMIN, Role.USER)
  @Get('/:courseId')
  async getCourseById(@Param('courseId') courseId: string) {
    const result = await this.courseService.findOne(CourseResDto, courseId);
    return result;
  }
}
