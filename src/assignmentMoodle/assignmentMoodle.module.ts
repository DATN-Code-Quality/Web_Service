import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AssignmentMoodleController } from './assignmentMoodle.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SubRolesGuard } from 'src/auth/guard/sub-roles.guard';
import { UserCourseModule } from 'src/user-course/user-course.module';

@Module({
  imports: [UserCourseModule],
  controllers: [AssignmentMoodleController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SubRolesGuard,
    },
  ],
  exports: [],
})
export class AssignmentMoodleModule {}
