import { Injectable, BadRequestException } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { OperationResult } from 'src/common/operation-result';
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
    // const handle = await this.client.start('UserInfoWorkflow', {
    //   args: ['email'],
    //   workflowId: `workflow-${new Date().getTime()}`,
    //   taskQueue: MOODLE_TASK_QUEUE,
    // });
    // const result = await handle.result();
    // return (result.data as User).name;
    return OperationResult.ok('Deleted Successfully');
  }
}
