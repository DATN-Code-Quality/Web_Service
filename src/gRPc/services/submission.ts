import { Observable } from 'rxjs';
import {
  GetSubmissionsOfAssignmentMoodleIdRequest,
  SubmissionResponce,
} from '../interfaces/Submission';

export interface SubmissionService {
  getSubmissionsByAssignmentId(
    assignmentMoodleId: GetSubmissionsOfAssignmentMoodleIdRequest,
  ): Observable<SubmissionResponce>;
}
