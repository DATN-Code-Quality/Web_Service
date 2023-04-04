import { Module } from '@nestjs/common';
import { UserMoodleController } from './userMoodle.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [],
  controllers: [UserMoodleController],
  providers: [],
  exports: [],
})
export class UserMoodleModule {}
