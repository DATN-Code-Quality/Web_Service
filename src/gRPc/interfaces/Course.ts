export interface Course {
  name: string;
  moodleId: string;
  courseMoodleId: string;
  startAt: string;
  endAt: string;
  detail: string | null;
  summary: string | null;
  categoryId: string;
}

export interface GetCourseOfUserRequest {
  userMoodleId: string;
}

export interface CoursesResponce {
  error: number;
  courses: Course[];
}

export interface GetCourseOfCategoryRequest {
  categoryMoodleId: string;
}

export interface GetCourseOfMoodleIdRequest {
  courseMoodleId: string;
}
