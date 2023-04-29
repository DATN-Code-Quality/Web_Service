import { Module } from '@nestjs/common';
import { UserMoodleController } from './userMoodle.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [],
  controllers: [UserMoodleController],
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
export class UserMoodleModule {}
