export interface IssueRequest {
  submissionId: string;
  type: string;
  severity: string;
  rule: string;
  file: string;
  page: number;
  pageSize: number;
}
