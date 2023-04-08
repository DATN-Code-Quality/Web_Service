import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { IssueService } from './issue.service';

@ApiTags('Issue Sonarqube')
@Controller('/api/sonarqube/issue')
export class IssueController implements OnModuleInit {
  private clientService: IssueService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.clientService = this.client.getService<IssueService>('IssueService');
  }

  @Get(':submissionId')
  async getIssueBySubmissionId(
    @Param('submissionId') submissionId: string,
    @Query('type', new DefaultValuePipe(null)) type: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ) {
    const result = await this.clientService.getIssuesBySubmissionId({
      submissionId: submissionId,
      page: page,
      pageSize: pageSize,
      type: type,
    });
    return result;
  }
}
