import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
import { FacultyService } from './faculty.service';
import { OperationResult } from 'src/common/operation-result';
@ApiTags('Faculty')
@Controller('/api/faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Roles(Role.ADMIN)
  @Get('/statistic')
  async getStatistic() {
    const result = await this.facultyService.getStatistic();
    if (result.isOk()) {
      return OperationResult.ok({
        result: result.data,
      });
    }
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/user/statistic')
  async getUserStatistic(
    @Request() req,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
  ) {
    return await this.facultyService.getUserStatistic(search, limit, offset);
  }

  @Roles(Role.ADMIN)
  @Get('/:userId/detailed-result')
  async getDetailResult(@Param('userId') userId: string) {
    const result = await this.facultyService.getResultbyUserId(userId);
    return result;
  }
}
