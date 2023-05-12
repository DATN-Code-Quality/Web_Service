import { Observable } from 'rxjs';
import { IssueRequest, IssueResponse } from '../interfaces/sonarqube/Issue';
import { RuleRequest, RuleResponse } from '../interfaces/sonarqube/Rule';
import { ResultRequest, ResultResponse } from '../interfaces/sonarqube/Result';
import { SourceRequest, SourceResponse } from '../interfaces/sonarqube/Source';

export interface SonarqubeService {
  getIssuesBySubmissionId(
    issueRequest: IssueRequest,
  ): Observable<IssueResponse>;
  getRuleDetailByKey(ruleRequest: RuleRequest): Observable<RuleResponse>;
  getResultsBySubmissionId(
    resultRequest: ResultRequest,
  ): Observable<ResultResponse>;
  getSourcesByKey(sourceRequest: SourceRequest): Observable<SourceResponse>;
}
