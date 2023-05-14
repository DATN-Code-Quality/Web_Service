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
} from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { ApiTags } from '@nestjs/swagger';
import { UserCourseResDto } from './res/user-course-res.dto';
import { Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';
import { UserCourseReqDto } from './req/user-course-req.dto';
@ApiTags('UserCourse')
@Controller('/api/user-course')
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

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
    // @Query('name', new DefaultValuePipe('')) name: string,
    // @Query('userId', new DefaultValuePipe('')) userId: string,
    @Query('role', new DefaultValuePipe(null)) role: string,
  ) {
    const result = await this.userCourseService.findUsersByCourseId(
      courseId,
      role,
    );
    return result;
  }

  // @Roles(Role.ADMIN, Role.USER)
  @Roles(Role.ADMIN)
  @Get('/:userId/courses')
  async getAllCoursesByUserId(
    @Param('userId') userId: string,
    // @Query('categoryId', new DefaultValuePipe(null)) categoryId: string,
    // @Query('name', new DefaultValuePipe('')) name: string,
  ) {
    const result = await this.userCourseService.findCoursesByUserId(userId);
    return result;
  }

  @Roles(Role.USER)
  @Get('/courses-of-user')
  async getAllCoursesOfUser(
    @Request() req,
    // @Query('categoryId', new DefaultValuePipe(null)) categoryId: string,
    // @Query('name', new DefaultValuePipe('')) name: string,
  ) {
    const userId = req.headers['userId'];
    const result = await this.userCourseService.findCoursesByUserId(userId);
    return result;
  }

  @Roles(Role.ADMIN)
  @Post('/:courseId')
  async addUsersIntoCourse(
    @Param('courseId') courseId: string,
    @Body() data: any,
    // @Body() teacherRoleIds: string[],
  ) {
    const result = await this.userCourseService.addUsersIntoCourse(
      courseId,
      data['studentRoleIds'],
      data['teacherRoleIds'],
    );
    return result;
  }
}
