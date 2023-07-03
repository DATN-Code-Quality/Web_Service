import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { SubRolesGuard } from 'src/auth/guard/sub-roles.guard';
import { UserCourseModule } from 'src/user-course/user-course.module';
import { SubmissionModule } from 'src/submission/submission.module';
import { ResultModule } from 'src/result/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignmentReqDto]),
    UserCourseModule,
    SubmissionModule,
    ResultModule,
  ],
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
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
  exports: [AssignmentService],
})
export class AssignmentModule {}
