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
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
import { FacultyService } from './faculty.service';
@ApiTags('Faculty')
@Controller('/api/faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  // @Roles(Role.ADMIN)
  // @Get('/facultys')
  // async getAllFacultys() {
  //   const result = await this.facultyService.findAll(FacultyResDto);
  //   return result;
  // }
}
