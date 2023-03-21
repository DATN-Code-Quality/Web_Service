import { Controller, Get } from '@nestjs/common';

@Controller('/api/user/moodle')
export class UserController {
  // constructor(private readonly appService: AppService) {}

  @Get('/get-user-by-email')
  async getUserByEmail() {
    // return await this.appService.getHello();
  }
}
