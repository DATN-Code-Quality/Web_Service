import { User } from 'src/temporal/interfaces/user.interface';

export interface UserResponse {
  error: number;
  users: User[];
}
