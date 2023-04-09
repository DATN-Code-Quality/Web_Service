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
import { CategoryService } from 'src/gRPc/services/category';
import { CourseService } from 'src/gRPc/services/course';
import { UserService } from 'src/gRPc/services/user';

@ApiTags('Courses Moodle')
@Controller('/api/course-moodle')
export class CourseMoodleController implements OnModuleInit {
  private userMoodleService: UserService;
  private courseMoodleService: CourseService;
  private categoryMoodleService: CategoryService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userMoodleService = this.client.getService<UserService>('UserService');
    this.courseMoodleService =
      this.client.getService<CourseService>('CourseService');
    this.categoryMoodleService =
      this.client.getService<CategoryService>('CategoryService');
  }

  @Get('/get-all-courses')
  async getAllCourses() {
    const result = this.courseMoodleService.getAllCourses({});
    return result;
  }

  @Get('/get-all-categories')
  async getAllCategories() {
    const result = this.categoryMoodleService.getAllCategories({});
    return result;
  }

  @Get('/get-courses-by-category')
  async getCoursesByCategory(@Query() query: string) {
    const result = this.courseMoodleService.getCoursesByCategory({
      categoryMoodleId: query['categoryMoodleId'],
    });
    return result;
  }

  @Get('/get-courses-detail-by-moodle-id')
  async getCourseDetailByMoodleId(@Query() query: string) {
    const result = this.courseMoodleService.getCoursesByMoodleId({
      courseMoodleId: query['courseMoodleId'],
    });
    return result;
  }
}
