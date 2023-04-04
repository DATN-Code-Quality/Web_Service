import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { ProjectService } from './project.service';
import { ProjectResDto } from './res/project-res.dto';
const SALTROUNDS = 10;
@ApiTags('Project')
@Controller('/api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}


  @Get('/get-all-project')
  async getAllProjects() {
    const result = await this.projectService.findAll(ProjectResDto);
    return result;
  }
}
