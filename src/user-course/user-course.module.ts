import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourseReqDto } from './req/user-course-req.dto';
import { UserCourseController } from './user-course.controller';
import { UserCourseService } from './user-course.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCourseReqDto]),],
  controllers: [UserCourseController],
  providers: [UserCourseService],
  exports: [UserCourseService],
})
export class UserCourseModule {}
