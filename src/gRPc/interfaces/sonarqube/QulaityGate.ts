export interface Condition {
  key: string;
  error: number;
}

export interface QualityGateRequest {
  submissionId: Condition[];
}

export interface QualityGateResponse {
  data: string;
  error: number;
  message: string;
}
