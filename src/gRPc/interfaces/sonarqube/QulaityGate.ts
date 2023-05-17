import { error } from 'console';

export interface Condition {
  key: string;
  error: number;
}

export interface QualityGateRequest {
  assignmentId: string;
  conditions: Condition[];
}

export interface QualityGateResponse {
  data: string;
  error: number;
  message: string;
}

export function defaultConfig(assignmentId: string) {
  return {
    assignmentId: assignmentId,
    conditions: [
      {
        key: 'code_smells',
        error: 20,
      },
      {
        key: 'bugs',
        error: 10,
      },
      {
        key: 'vulnerabilities',
        error: 10,
      },
      {
        key: 'violations',
        error: 20,
      },
      {
        key: 'blocker_violations',
        error: 10,
      },
      {
        key: 'critical_violations',
        error: 10,
      },
      {
        key: 'major_violations',
        error: 10,
      },
      {
        key: 'minor_violations',
        error: 10,
      },
      {
        key: 'info_violations',
        error: 10,
      },
      {
        key: 'duplicated_lines_density',
        error: 10,
      },
      {
        key: 'coverage',
        error: 0,
      },
    ],
  };
}
