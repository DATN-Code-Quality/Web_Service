import { IssueRequest } from 'src/gRPc/interfaces/issue/IssueRequest';
import { Observable } from 'rxjs';
import { SourceRequest } from 'src/gRPc/interfaces/source/SourceRequest';

export interface SourceService {
  getSourcesByKey(sourceRequest: SourceRequest): Observable<any>;
}
