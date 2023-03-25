import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { MOODLE_TASK_QUEUE } from 'src/config/workflowConstant';
import { Workflows } from 'src/temporal/workflows';

@ApiTags('User Moodle')
@Controller('/api/user-moodle')
export class UserMoodleController {
  constructor(
    @InjectTemporalClient() private readonly client: WorkflowClient,
  ) {}

  @Get('/get-user-by-email')
  async getUserByEmail() {
    const handle = await this.client.start(Workflows.GetUsersByEmail, {
      args: [['vuagio.2402@gmail.com']],
      workflowId: `workflow-${new Date().getTime()}`,
      taskQueue: MOODLE_TASK_QUEUE,
    });
    const result = await handle.result();
    return result;
    // return await this.appService.getHello();
  }
}
