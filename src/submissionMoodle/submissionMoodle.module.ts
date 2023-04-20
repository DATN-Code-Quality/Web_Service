import { Module } from '@nestjs/common';
import { SubmissionMoodleController } from './submissionMoodle.controller';

@Module({
  imports: [],
  controllers: [SubmissionMoodleController],
  providers: [],
  exports: [],
})
export class SubmissionMoodleModule {}
