import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourseReqDto } from './req/user-course-req.dto';
import { UserCourseController } from './user-course.controller';
import { UserCourseService } from './user-course.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { SubRolesGuard } from 'src/auth/guard/sub-roles.guard';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { SubmissionModule } from 'src/submission/submission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCourseReqDto]),
    // AssignmentModule,
    // SubmissionModule,
  ],
  controllers: [UserCourseController],
  providers: [
    UserCourseService,
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
  exports: [UserCourseService],
})
export class UserCourseModule {}
