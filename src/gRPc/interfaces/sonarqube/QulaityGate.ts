import { ConfigObject } from 'src/assignment/req/assignment-req.dto';

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

export function createCondition(configObject: ConfigObject): Condition[] {
  return [
    {
      key: 'code_smells',
      error: configObject.code_smells,
    },
    {
      key: 'bugs',
      error: configObject.bugs,
    },
    {
      key: 'vulnerabilities',
      error: configObject.vulnerabilities,
    },
    {
      key: 'violations',
      error: configObject.violations,
    },
    {
      key: 'blocker_violations',
      error: configObject.blocker_violations,
    },
    {
      key: 'critical_violations',
      error: configObject.critical_violations,
    },
    {
      key: 'major_violations',
      error: configObject.major_violations,
    },
    {
      key: 'minor_violations',
      error: configObject.minor_violations,
    },
    {
      key: 'info_violations',
      error: configObject.info_violations,
    },
    {
      key: 'duplicated_lines_density',
      error: configObject.duplicated_lines_density,
      // ? configObject.duplicated_lines_density
      // : 100,
    },
    {
      key: 'coverage',
      error: configObject.coverage, //? configObject.coverage : 0,
    },
  ];
}
