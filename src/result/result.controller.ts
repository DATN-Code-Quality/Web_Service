import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResultResDto } from './res/result-res.dto';
import { Public, Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';
import { ClientGrpc } from '@nestjs/microservices';
import { IssueService } from 'src/gRPc/services/issue';
import { ResultService } from 'src/gRPc/services/result';
@ApiTags('Result')
@Controller('/api/result')
export class ResultController implements OnModuleInit {
  private clientService: ResultService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc, // private readonly resultService: ResultService
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<ResultService>('GResultService');
  }

  // @Roles(Role.USER)
  // @Get('/results')
  // async getAllResults() {
  //   const result = await this.resultService.findAll(ResultResDto);
  //   return result;
  // }

  // @SubRoles(SubRole.TEACHER, SubRole.STUDENT)
  // @Public()
  @Roles(Role.USER)
  @Get(':submissionId')
  async getIssueBySubmissionId(
    @Param('submissionId') submissionId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ) {
    const result = await this.clientService.getResultsBySubmissionId({
      submissionId: submissionId,
      page: page,
      pageSize: pageSize,
    });
    return result;
  }
}
