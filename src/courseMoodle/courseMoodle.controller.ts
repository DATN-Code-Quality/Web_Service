import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { SubRole } from 'src/auth/auth.const';
import { SubRoles } from 'src/auth/auth.decorator';
import { ServiceResponse } from 'src/common/service-response';
import { GCategoryService } from 'src/gRPc/services/category';
import { GCourseService } from 'src/gRPc/services/course';

@ApiTags('Courses Moodle')
@Controller('/api/course-moodle')
export class CourseMoodleController implements OnModuleInit {
  private courseMoodleService: GCourseService;
  private categoryMoodleService: GCategoryService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.courseMoodleService =
      this.client.getService<GCourseService>('GCourseService');
    this.categoryMoodleService =
      this.client.getService<GCategoryService>('GCategoryService');
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/get-all-courses')
  async getAllCourses() {
    const response$ = this.courseMoodleService.getAllCourses({}).pipe();
    const resultDTO = await firstValueFrom(response$);
    const courses = resultDTO.data.map((course) => ({
      ...course,
      startAt: new Date(parseInt(course.startAt, 10) * 1000),
      endAt: new Date(parseInt(course.endAt, 10) * 1000),
    }));
    const newResultDTO = {
      ...resultDTO,
      courses,
    };
    const result = ServiceResponse.resultFromServiceResponse(
      newResultDTO,
      'courses',
    );
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/get-all-categories')
  async getAllCategories() {
    const response$ = this.categoryMoodleService.getAllCategories({}).pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(
      resultDTO,
      'categories',
    );
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/get-courses-by-category')
  async getCoursesByCategory(@Query() query: string) {
    const response$ = this.courseMoodleService
      .getCoursesByCategory({
        categoryMoodleId: query['categoryMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const courses = resultDTO.data.map((course) => ({
      ...course,
      startAt: new Date(parseInt(course.startAt, 10) * 1000),
      endAt: new Date(parseInt(course.endAt, 10) * 1000),
    }));
    const newResultDTO = {
      ...resultDTO,
      courses,
    };
    const result = ServiceResponse.resultFromServiceResponse(
      newResultDTO,
      'courses',
    );
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/get-courses-detail-by-course-moodle-id')
  async getCourseDetailByMoodleId(@Query() query: string) {
    const response$ = this.courseMoodleService
      .getCoursesByMoodleId({
        courseMoodleId: query['courseMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const courses = resultDTO.data.map((course) => ({
      ...course,
      startAt: new Date(parseInt(course.startAt, 10) * 1000),
      endAt: new Date(parseInt(course.endAt, 10) * 1000),
    }));
    const newResultDTO = {
      ...resultDTO,
      courses,
    };
    const result = ServiceResponse.resultFromServiceResponse(
      newResultDTO,
      'courses',
    );
    return result;
  }
}
