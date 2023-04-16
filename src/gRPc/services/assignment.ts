import { Observable } from 'rxjs';
import {
  AssignmentsCronjobRequest,
  AssignmentsResponce,
  GetAssignmentsOfCourseRequest,
} from '../interfaces/Assignment';

export interface GAssignmentService {
  getAllAssignmentsByCourseId(
    courseMoodleId: GetAssignmentsOfCourseRequest,
  ): Observable<AssignmentsResponce>;
  addAssignmentCronjob(data: AssignmentsCronjobRequest): Observable<{}>;
}
