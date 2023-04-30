import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
import { SourceService } from 'src/gRPc/services/source';

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
