import { Injectable } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { MOODLE_TASK_QUEUE } from './config/workflowConstant';
import { User } from './temporal/interfaces/user.interface';
import { DBServiceWorkflows, Workflows } from './temporal/workflows';

@Injectable()
export class AppService {
  constructor(
    @InjectTemporalClient() private readonly client: WorkflowClient,
  ) {}

  // async getHello() {
  //   const handle = await this.client.start(Workflows.UserInfoWorkflow, {
  //     args: ['email'],
  //     workflowId: `workflow-${new Date().getTime()}`,
  //     taskQueue: MOODLE_TASK_QUEUE,
  //   });
  //   const result = await handle.result();

  //   return (result.data as User).name;
  // }
  async getHello() {
    const handle = await this.client.start(DBServiceWorkflows.getUserDetail, {
      args: ['email'],
      workflowId: `workflow-${new Date().getTime()}`,
      taskQueue: 'database-service-task-queue',
    });
    const result = await handle.result();

    return result as string;
  }
}
