import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionReqDto } from './req/submission-req.dto';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { SubRolesGuard } from 'src/auth/guard/sub-roles.guard';
import { UserCourseModule } from 'src/user-course/user-course.module';
import { AssignmentModule } from 'src/assignment/assignment.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionReqDto]), UserCourseModule],
  controllers: [SubmissionController],
  providers: [
    SubmissionService,
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
  exports: [SubmissionService],
})
export class SubmissionModule {}
