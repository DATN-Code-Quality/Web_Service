import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectReqDto } from './req/project-req.dto';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectReqDto])],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
