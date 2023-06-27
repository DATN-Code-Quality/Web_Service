import { Observable } from 'rxjs';
import { IssueRequest, IssueResponse } from '../interfaces/sonarqube/Issue';
import { RuleRequest, RuleResponse } from '../interfaces/sonarqube/Rule';
import { ResultRequest, ResultResponse } from '../interfaces/sonarqube/Result';
import { SourceRequest, SourceResponse } from '../interfaces/sonarqube/Source';
import {
  QualityGateRequest,
  QualityGateResponse,
} from '../interfaces/sonarqube/QulaityGate';
import {
  ComponentRequest,
  ComponentResponse,
} from '../interfaces/sonarqube/Component';

export interface GSonarqubeService {
  getIssuesBySubmissionId(
    issueRequest: IssueRequest,
  ): Observable<IssueResponse>;
  getRuleDetailByKey(ruleRequest: RuleRequest): Observable<RuleResponse>;
  getResultsBySubmissionId(
    resultRequest: ResultRequest,
  ): Observable<ResultResponse>;
  getComponentsBySubmissionId(
    componentRequest: ComponentRequest,
  ): Observable<ComponentResponse>;
  getSourcesByKey(sourceRequest: SourceRequest): Observable<SourceResponse>;
  createQualityGate(
    qualityGateRequest: QualityGateRequest,
  ): Observable<QualityGateResponse>;

  updateConditions(
    qualityGateRequest: QualityGateRequest,
  ): Observable<QualityGateResponse>;
}
