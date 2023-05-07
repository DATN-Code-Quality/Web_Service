import { Observable } from 'rxjs';
import {
  GetSubmissionsOfAssignmentMoodleIdRequest,
  ScanSubmissionRequest,
  SubmissionResponce,
} from '../interfaces/Submission';

export interface GSubmissionService {
  getSubmissionsByAssignmentId(
    assignmentMoodleId: GetSubmissionsOfAssignmentMoodleIdRequest,
  ): Observable<SubmissionResponce>;

  scanSubmission(submission: ScanSubmissionRequest): Observable<{}>;
}
