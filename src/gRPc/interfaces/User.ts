import { IsNumber, Min } from 'class-validator';

export interface User {
  name: string;
  role: string;
  email: string;
  userId: string;
  moodleId: string;
  password: string;
  status: number;
}

export interface UserRequest {
  emails: string[];
}

export class CourseUserRequest {
  @IsNumber()
  @Min(1)
  courseMoodleId: number;
}

export interface UserResponse {
  data: User[];
  error: number;
}
