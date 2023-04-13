import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CourseController } from 'src/course/course.controller';
import { CourseMoodleController } from './courseMoodle.controller';

@Module({
  imports: [],
  controllers: [CourseMoodleController],
  providers: [],
  exports: [],
})
export class CourseMoodleModule {}
