import { Module } from '@nestjs/common';
import { UserMoodleController } from './userMoodle.controller';

@Module({
  imports: [],
  controllers: [UserMoodleController],
  providers: [],
  exports: [],
})
export class UserMoodleModule {}
