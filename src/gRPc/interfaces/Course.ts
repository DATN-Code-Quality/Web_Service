import { IsNumber, IsString, Min } from 'class-validator';

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

export class GetCourseOfUserRequest {
  @IsNumber()
  @Min(1)
  userMoodleId: number;
}

export interface CoursesResponce {
  error: number;
  data: Course[];
}

export class GetCourseOfCategoryRequest {
  @IsNumber()
  @Min(1)
  categoryMoodleId: number;
}

export class GetCourseOfMoodleIdRequest {
  @IsNumber()
  @Min(1)
  courseMoodleId: number;
}

export class CourseCronjobRequest {
  @IsString()
  id: string;

  @IsNumber()
  @Min(1)
  courseMoodleId: number;

  @IsNumber()
  @Min(1)
  endAt: number;
}
