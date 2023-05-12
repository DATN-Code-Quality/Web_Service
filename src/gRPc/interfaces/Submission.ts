import { IsNumber, Min } from 'class-validator';
import {
  SUBMISSION_STATUS,
  SubmissionReqDto,
} from 'src/submission/req/submission-req.dto';

export interface Submission {
  assignmentId: string;
  link: string;
  note: string | null;
  submitType: string;
  timemodified: string;
  userId: string;
  origin: string;
  status: string;
  grade: number | null;
  submissionMoodleId: string;
}

export interface SubmissionResponce {
  error: number;
  data: Submission[];
}

export class GetSubmissionsOfAssignmentMoodleIdRequest {
  @IsNumber()
  @Min(1)
  assignmentMoodleId: number;
}

export interface ScanSubmissionRequest {
  id: string;
  assignmentId: string;
  link: string;
  note: string | null;
  submitType: string;
  timemodified: Date;
  userId: string;
  origin: string;
  status: SUBMISSION_STATUS;
  grade: number | null;
  submissionMoodleId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
