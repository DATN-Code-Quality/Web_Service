import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  Request,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Role, SubRole } from 'src/auth/auth.const';
import { Roles, SubRoles } from 'src/auth/auth.decorator';
import { OperationResult } from 'src/common/operation-result';
import { GMoodleService } from 'src/gRPc/services/moodle';

@ApiTags('Moodle')
@Controller('/api/moodle')
export class MoodleController implements OnModuleInit {
  private gMoodleService: GMoodleService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.gMoodleService =
      this.client.getService<GMoodleService>('GMoodleService');
  }

  @Roles(Role.ADMIN)
  @Post('/connect')
  async connect(@Body() data: any) {
    const username = data['username'];
    const password = data['password'];
    const serviceName = data['serviceName'];
    const host = data['host'];

    const result = await firstValueFrom(
      await this.gMoodleService.ConnectMoodle({
        username: username,
        password: password,
        serviceName: serviceName,
        host: host,
      }),
    );

    if (result.error === 0) {
      return OperationResult.ok(result.message);
    } else {
      return OperationResult.error(new Error(result.message));
    }
  }
}
