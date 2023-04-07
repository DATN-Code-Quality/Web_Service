import { Body, Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UserRequest } from 'src/gRPc/interfaces/user/UserRequest';

interface UserService {
  getUsersByEmails(emails: UserRequest): Observable<any>;
}

@ApiTags('User Moodle')
@Controller('/api/user-moodle')
export class UserMoodleController implements OnModuleInit {
  private clientService: UserService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.clientService = this.client.getService<UserService>('UserService');
  }

  @Get('/get-user-by-email')
  async getUserByEmail(@Body() emails: string[]) {
    const result = this.clientService.getUsersByEmails({ emails });

    return result;
  }
}
