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
import { RuleService } from './rule.service';

@ApiTags('Rule Sonarqube')
@Controller('/api/sonarqube/rule')
export class RuleController implements OnModuleInit {
  private clientService: RuleService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.clientService = this.client.getService<RuleService>('GRuleService');
  }

  @Get(':key')
  async getIssueBySubmissionId(@Param('key') key: string) {
    const result = await this.clientService.getRuleDetailByKey({
      key: key,
    });
    return result;
  }
}
