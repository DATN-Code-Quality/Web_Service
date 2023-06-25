import { Module } from '@nestjs/common';
import { SubmissionMoodleController } from './submissionMoodle.controller';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Module({
  imports: [],
  controllers: [SubmissionMoodleController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class SubmissionMoodleModule {}
