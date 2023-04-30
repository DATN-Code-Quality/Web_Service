import { IssueRequest } from 'src/gRPc/interfaces/issue/IssueRequest';
import { Observable } from 'rxjs';

export interface IssueService {
  getIssuesBySubmissionId(issueRequest: IssueRequest): Observable<any>;
}
