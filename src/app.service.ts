import { Injectable } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { User } from './temporal/interfaces/user.interface';
import { Workflows } from './temporal/workflows';

@Injectable()
export class AppService {
  constructor(
    @InjectTemporalClient() private readonly client: WorkflowClient,
  ) {}

  async getHello() {
    const handle = await this.client.start(Workflows.UserInfoWorkflow, {
      args: ['email'],
      workflowId: `workflow-${new Date().getTime()}`,
      taskQueue: 'moodle-task-queue',
    });
    const result = await handle.result();

    return (result.data as User).name;
  }
}
