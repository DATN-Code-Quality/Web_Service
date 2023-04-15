import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { CourseService } from './course.service';
import { CourseResDto } from './res/course-res.dto';
import { CourseReqDto } from './req/course-req.dto';
const SALTROUNDS = 10;
@ApiTags('Course')
@Controller('/api/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/add-courses')
  async addSubmissions(@Body() courses: CourseReqDto[]) {
    const result = await this.courseService.createMany(CourseResDto, courses);
    return result;
  }

  @Get('/get-all-course')
  async getAllCourses() {
    const result = await this.courseService.findAll(CourseResDto);
    return result;
  }

  @Get('/get-course/:courseId')
  async getCourseById(@Param('courseId') courseId: string) {
    const result = await this.courseService.findOne(CourseResDto, courseId);
    return result;
  }
}
