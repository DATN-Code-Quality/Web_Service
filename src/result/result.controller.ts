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
import { ResultService } from './result.service';
import { ResultResDto } from './res/result-res.dto';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
@ApiTags('Result')
@Controller('/api/result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Roles(Role.USER)
  @Get('/results')
  async getAllResults() {
    const result = await this.resultService.findAll(ResultResDto);
    return result;
  }
}
