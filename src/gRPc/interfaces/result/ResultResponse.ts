import { Result } from './Result';

export interface ResultResponse {
  data: Result;
  error: number;
  message: string;
}
