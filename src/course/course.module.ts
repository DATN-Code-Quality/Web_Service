import { Global, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseReqDto } from './req/course-req.dto';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { SubRolesGuard } from 'src/auth/guard/sub-roles.guard';
import { UserCourseModule } from 'src/user-course/user-course.module';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { SubmissionModule } from 'src/submission/submission.module';
import { UserModule } from 'src/user/user.module';
import { ResultModule } from 'src/result/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseReqDto]),
    UserCourseModule,
    AssignmentModule,
    SubmissionModule,
    forwardRef(() => UserCourseModule),
    UserModule,
    ResultModule,
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SubRolesGuard,
    },
  ],
  exports: [CourseService],
})
export class CourseModule {}
