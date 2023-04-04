export interface User {
  name: string;
  role: string;
  email: string;
  userId: string;
  moodleId: string;
  password: string;
  status: boolean;
}

export interface UserRequest {
  emails: string[];
}

export interface UserResponse {
  users: User[];
  error: number;
}
