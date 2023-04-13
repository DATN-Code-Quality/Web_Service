import { Observable } from 'rxjs';
import { UserRequest } from '../interfaces/User';
import {
  AssignmentsResponce,
  GetAssignmentsOfCourseRequest,
} from '../interfaces/Assignment';

export interface AssignmentService {
  getAllAssignmentsByCourseId(
    courseMoodleId: GetAssignmentsOfCourseRequest,
  ): Observable<AssignmentsResponce>;
}
