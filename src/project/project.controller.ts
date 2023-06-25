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
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
@ApiTags('Project')
@Controller('/api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles(Role.USER)
  @Get('/projects')
  async getAllProjects() {
    const result = await this.projectService.findAll(ProjectResDto);
    return result;
  }
}
