import { Injectable, BadRequestException } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { OperationResult } from 'src/common/operation-result';
import { DBServiceWorkflows } from 'src/temporal/workflows';
import { UserReqDto } from './req/user-req.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectTemporalClient() private readonly client: WorkflowClient,
  ) {}

  async addUsers(users: UserReqDto[]) {
    if (users.length === 0) {
      throw new BadRequestException('Please add at least 1 user');
    }
    const handle = await this.client.start(DBServiceWorkflows.createManyUsers, {
      args: [users],
      workflowId: `workflow-${new Date().getTime()}`,
      taskQueue: 'database-service-task-queue-user',
    });
    const result = await handle.result();
    return result;
  }
  async updateUser(user: UserReqDto, userId: string) {
    const handle = await this.client.start(DBServiceWorkflows.updateUser, {
      args: [userId, user],
      workflowId: `workflow-${new Date().getTime()}`,
      taskQueue: 'database-service-task-queue-user',
    });
    const result = await handle.result();
    return result;
  }
  async deleteUser(userId: string) {
    const handle = await this.client.start(DBServiceWorkflows.removeUser, {
      args: [userId],
      workflowId: `workflow-${new Date().getTime()}`,
      taskQueue: 'database-service-task-queue-user',
    });
    const result = await handle.result();
    return result;
  }
}
