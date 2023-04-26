import { RuleDetail } from './Rule';

export interface RuleResponse {
  data: RuleDetail;
  error: number;
  message: string;
}
