import { Issue } from './Issue';

export interface IssueResponse {
  data: Issue;
  error: number;
  message: string;
}
