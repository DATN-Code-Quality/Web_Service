import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SourceService } from './source.service';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';

@ApiTags('Source Sonarqube')
@Controller('/api/sonarqube/source')
export class SourceController implements OnModuleInit {
  private clientService: SourceService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<SourceService>('GSourceService');
  }

  @Roles(Role.USER)
  @Get(':key')
  async getSourceByEmail(@Param('key') key: string) {
    const result = await this.clientService.getSourcesByKey({ key: key });
    return result;
  }
}
