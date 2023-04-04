import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectReqDto } from './req/project-req.dto';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectReqDto]),],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
