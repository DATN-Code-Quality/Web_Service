import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { UserCourseResDto } from './res/user-course-res.dto';
const SALTROUNDS = 10;
@ApiTags('UserCourse')
@Controller('/api/user-course')
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Get('/get-all-user-course')
  async getAllUsers() {
    const result = await this.userCourseService.findAll(UserCourseResDto);
    return result;
  }
}
