import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultReqDto } from './req/result-req.dto';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { SubRolesGuard } from 'src/auth/guard/sub-roles.guard';
import { UserCourseModule } from 'src/user-course/user-course.module';

@Module({
  imports: [TypeOrmModule.forFeature([ResultReqDto]), UserCourseModule],
  controllers: [ResultController],
  providers: [
    ResultService,
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
  exports: [ResultService],
})
export class ResultModule {}
