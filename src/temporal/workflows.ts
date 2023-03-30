/* eslint-disable @typescript-eslint/no-empty-function */
// import { proxyActivities } from '@temporalio/workflow';
import { UserReqDto } from 'src/user/req/user-req.dto';
import { ResultObject } from './interfaces/result.interface';
import { User } from './interfaces/user.interface';
// Only import the activity types
// import type * as activities from './activities';

export const Workflows = {
  GetUsersByEmail: (email: string[]): Promise<ResultObject<User>> => {
    return new Promise((resolve, reject) => {});
  },
};
export const DBServiceWorkflows = {
  getUserDetail(email: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise((resolve, reject) => {});
  },
  createManyUsers(user: UserReqDto[]): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise((resolve, reject) => {});
  },
  updateUser(userId: string, user: UserReqDto): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise((resolve, reject) => {});
  },
  removeUser(userId: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise((resolve, reject) => {});
  },
};
