import { Observable } from 'rxjs';
import {
  UserRequest,
  UserResponse,
  CourseUserRequest,
} from '../interfaces/User';

export interface GUserService {
  getUsersByEmails(emails: UserRequest): Observable<UserResponse>;
  getAllUsers({}): Observable<UserResponse>;
  getUsersByCourseMoodleId(
    courseMoodleId: CourseUserRequest,
  ): Observable<UserResponse>;
}
