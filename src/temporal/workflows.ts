import { proxyActivities } from '@temporalio/workflow';
import { ResultObject } from './interfaces/result.interface';
import { User } from './interfaces/user.interface';
// Only import the activity types
// import type * as activities from './activities';

// interface Activities {
//   getUser: (name: string) => Promise<string>;
//   getCourses: (name: string) => Promise<string>;
// }

// const { getUser } = proxyActivities<Activities>({
//   startToCloseTimeout: '1 minute',
// });

/** A workflow that simply calls an activity */
// export async function MoodleWorkflow(name: string): Promise<string> {
//   return await getUser(name);
// }

export const Workflows = {
  UserInfoWorkflow: (email: string): Promise<ResultObject<User>> => {
    return new Promise((resolve, reject) => {});
  },
};
export const DBServiceWorkflows = {
  getUserDetail(email: string): Promise<string> {
    return new Promise((resolve, reject) => {});
  },
};
