import { Observable } from 'rxjs';
import { RuleRequest } from 'src/gRPc/interfaces/rule/RuleRequest';

export interface RuleService {
  getRuleDetailByKey(ruleRequest: RuleRequest): Observable<any>;
}
