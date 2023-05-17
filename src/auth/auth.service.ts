import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OperationResult } from 'src/common/operation-result';
import {
  getUserAsync,
  getUserTokenAsync,
  initializeGraphForUserAuth,
} from './outlook/graphHelper';
import settings, { AppSettings } from './outlook/appSettings';
import { DeviceCodeInfo } from '@azure/identity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string): Promise<any> {
    // const hashedPassword = await this.usersService.hashPassword(password);

    const result = await this.usersService.findUserByUsernameAndPassword(
      userId,
      password,
      //   hashedPassword,
    );
    return result;
  }
  async generateToken(user: any) {
    const payload = { user: user.data };
    const token = await this.jwtService.signAsync(payload);
    return OperationResult.ok({
      user: user.data,
      accessToken: {
        token: token,
        expiredAt: this.jwtService.decode(token)['exp'],
      },
    });
  }

  async loginWithOutlook() {
    // Khởi tạo app
    initializeGraphForUserAuth(settings, (info: DeviceCodeInfo) => {
    });

    //Get user
    try {
      const user = await getUserAsync();
    } catch (err) {
    }

    // Get token
    try {
      const userToken = await getUserTokenAsync();
    } catch (err) {
    }
  }
}
