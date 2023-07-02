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
import { ResultService } from './result.service';
@ApiTags('Result')
@Controller('/api/result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  // @Roles(Role.USER)
  // @Get('/results')
  // async getAllResults() {
  //   const result = await this.resultService.findAll(ResultResDto);
  //   return result;
  // }
}
