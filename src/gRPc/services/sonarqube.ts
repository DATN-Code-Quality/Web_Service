import { Observable } from 'rxjs';
import { IssueRequest } from '../interfaces/sonarqube/Issue';
import { RuleRequest } from '../interfaces/sonarqube/Rule';
import { ResultRequest } from '../interfaces/sonarqube/Result';
import { SourceRequest } from '../interfaces/sonarqube/Source';

export interface SonarqubeService {
  getIssuesBySubmissionId(issueRequest: IssueRequest): Observable<any>;
  getRuleDetailByKey(ruleRequest: RuleRequest): Observable<any>;
  getResultsBySubmissionId(resultRequest: ResultRequest): Observable<any>;
  getSourcesByKey(sourceRequest: SourceRequest): Observable<any>;
}
