import { Observable } from 'rxjs';
import { UserRequest } from '../interfaces/User';

export interface UserService {
  getUsersByEmails(emails: UserRequest): Observable<any>;
  getAllUsers({}): Observable<any>;
}
