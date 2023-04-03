import { Injectable } from '@nestjs/common';
import { UserReqDto } from './req/user-req.dto';

@Injectable()
export class UserService {
  constructor() {}

  async addUsers(users: UserReqDto[]) {}
  async updateUser(user: UserReqDto, userId: string) {}
  async deleteUser(userId: string) {}
}
