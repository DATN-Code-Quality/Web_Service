import { Observable } from 'rxjs';
import { UserRequest } from 'src/gRPc/interfaces/User';

export interface UserService {
  getUsersByEmails(emails: UserRequest): Observable<any>;
  getAllUsers(params: any): Observable<any>;
}
