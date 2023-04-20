import { Observable } from 'rxjs';
import {
  GetSubmissionsOfAssignmentMoodleIdRequest,
  SubmissionResponce,
} from '../interfaces/Submission';

export interface GSubmissionService {
  getSubmissionsByAssignmentId(
    assignmentMoodleId: GetSubmissionsOfAssignmentMoodleIdRequest,
  ): Observable<SubmissionResponce>;
}
