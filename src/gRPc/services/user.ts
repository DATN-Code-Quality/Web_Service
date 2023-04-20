import { Observable } from 'rxjs';
import { UserRequest, UserResponse } from '../interfaces/User';

export interface GUserService {
  getUsersByEmails(emails: UserRequest): Observable<UserResponse>;
  getAllUsers({}): Observable<UserResponse>;
}
