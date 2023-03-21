import { Injectable } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';

@Injectable()
export class UserService {
  constructor(
    @InjectTemporalClient() private readonly client: WorkflowClient,
  ) {}

  //   async addUsers() {
  //     const handle = await this.client.start('UserInfoWorkflow', {
  //       args: ['email'],
  //       workflowId: `workflow-${new Date().getTime()}`,
  //       taskQueue: MOODLE_TASK_QUEUE,
  //     });
  //     const result = await handle.result();

  //     return (result.data as User).name;
  //   }
}
