import { IsNumber, Min } from 'class-validator';

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
