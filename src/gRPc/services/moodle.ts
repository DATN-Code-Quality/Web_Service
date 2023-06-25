import { Observable } from 'rxjs';
import {
  ConnectMoodleRequest,
  ConnectMoodleResponse,
  IsMoodleConnectedResponse,
} from '../interfaces/moodle';

export interface GMoodleService {
  ConnectMoodle(data: ConnectMoodleRequest): Observable<ConnectMoodleResponse>;

  IsMoodleConnected({}): Observable<IsMoodleConnectedResponse>;
}
