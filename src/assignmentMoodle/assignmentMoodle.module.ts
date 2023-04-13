import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AssignmentMoodleController } from './assignmentMoodle.controller';

@Module({
  imports: [],
  controllers: [AssignmentMoodleController],
  providers: [],
  exports: [],
})
export class AssignmentMoodleModule {}
