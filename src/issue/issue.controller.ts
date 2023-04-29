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
import { Public, Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';

@ApiTags('Issue Sonarqube')
@Controller('/api/sonarqube/issue')
export class IssueController implements OnModuleInit {
  private clientService: IssueService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.clientService = this.client.getService<IssueService>('GIssueService');
  }

  @Roles(Role.USER)
  @SubRoles(SubRole.STUDENT)
  @Get(':submissionId')
  async getIssueBySubmissionId(
    @Param('submissionId') submissionId: string,
    @Query('type', new DefaultValuePipe(null)) type: string,
    @Query('severity', new DefaultValuePipe(null)) severity: string,
    @Query('rule', new DefaultValuePipe(null)) rule: string,
    @Query('file', new DefaultValuePipe(null)) file: string,

    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ) {
    const result = await this.clientService.getIssuesBySubmissionId({
      submissionId: submissionId,
      page: page,
      pageSize: pageSize,
      type: type,
      severity: severity,
      rule: rule,
      file: file,
    });
    return result;
  }
}
