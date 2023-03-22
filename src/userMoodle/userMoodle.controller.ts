import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceResponse } from 'src/common/service-response';

@ApiTags('User Moodle')
@Controller('/api/user-moodle')
export class UserController {
  // constructor(private readonly appService: AppService) {}

  @Get('/get-user-by-email')
  async getUserByEmail() {
    // return ServiceResponse.fromResult(result)
    // return await this.appService.getHello();
  }
}
