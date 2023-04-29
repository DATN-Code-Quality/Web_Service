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
import { UserCourseResDto } from './res/user-course-res.dto';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
@ApiTags('UserCourse')
@Controller('/api/user-course')
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Get('/get-all-user-course')
  async getAllUsers() {
    const result = await this.userCourseService.findAll(UserCourseResDto);
    return result;
  }
}
