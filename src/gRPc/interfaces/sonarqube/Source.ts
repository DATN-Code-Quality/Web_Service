export interface Source {
  line: number;
  code: string;
}

export interface SourceRequest {
  key: string;
}

export interface SourceResponse {
  data: Source[];
  error: number;
  message: string;
}
