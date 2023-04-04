import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { CourseService } from './course.service';
import { CourseResDto } from './res/course-res.dto';
const SALTROUNDS = 10;
@ApiTags('Course')
@Controller('/api/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Get('/get-all-course')
  async getAllCourses() {
    const result = await this.courseService.findAll(CourseResDto);
    return result;
  }
}
