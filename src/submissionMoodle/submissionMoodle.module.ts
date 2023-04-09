import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CourseController } from 'src/course/course.controller';
import { SubmissionController } from 'src/submission/submission.controller';
import { SubmissionMoodleController } from './submissionMoodle.controller';

@Module({
  imports: [],
  controllers: [SubmissionMoodleController],
  providers: [],
  exports: [],
})
export class SubmissionMoodleModule {}
