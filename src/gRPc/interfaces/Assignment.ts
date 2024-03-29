export interface Assignment {
  name: string;
  dueDate: Date;
  status: boolean;
  courseId: string;
  description: string | null;
  attachmentFileLink: string | null;
  config: string;
  assignmentMoodleId: string;
}

export interface GetAssignmentsOfCourseRequest {
  courseMoodleId: string;
}

export interface AssignmentsResponce {
  error: number;
  assignments: Assignment[];
}
