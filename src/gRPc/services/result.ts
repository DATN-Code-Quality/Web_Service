import { IssueRequest } from 'src/gRPc/interfaces/issue/IssueRequest';
import { Observable } from 'rxjs';
import { ResultRequest } from '../interfaces/result/ResultRequest';

export interface ResultService {
  getResultsBySubmissionId(resultRequest: ResultRequest): Observable<any>;
}
