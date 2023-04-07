import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
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

  @Get(':key')
  async getIssueByEmail(@Param('key') key: string) {
    const result = await this.clientService.getIssuesByKey({ key: key });
    return result;
  }
}
