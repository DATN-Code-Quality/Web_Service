import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { ResultService } from './result.service';
import { ResultResDto } from './res/result-res.dto';
const SALTROUNDS = 10;
@ApiTags('Result')
@Controller('/api/result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}


  @Get('/get-all-result')
  async getAllResults() {
    const result = await this.resultService.findAll(ResultResDto);
    return result;
  }
}
