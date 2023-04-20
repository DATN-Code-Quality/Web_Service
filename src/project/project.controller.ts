import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProjectResDto } from './res/project-res.dto';
@ApiTags('Project')
@Controller('/api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/projects')
  async getAllProjects() {
    const result = await this.projectService.findAll(ProjectResDto);
    return result;
  }
}
