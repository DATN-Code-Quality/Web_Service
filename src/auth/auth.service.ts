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
    // console.log(hashedPassword);
    // console.log(password);

    const result = await this.usersService.findUserByUsernameAndPassword(
      userId,
      password,
      //   hashedPassword,
    );
    return result;
  }
  async generateToken(user: any) {
    const payload = { user: user.data };
    return OperationResult.ok({
      user: user.data,
      accessToken: await this.jwtService.signAsync(payload),
    });
  }

  async loginWithOutlook() {
    // Khởi tạo app
    initializeGraphForUserAuth(settings, (info: DeviceCodeInfo) => {
      console.log('Call to init app');
      console.log(info.verificationUri);
      console.log(info.userCode);
    });
    console.log('-------------------------------------------------');

    //Get user
    try {
      console.log('Call to get user');

      const user = await getUserAsync();
      console.log(user);
    } catch (err) {
      console.log(`Error getting user: ${err}`);
    }
    console.log('-------------------------------------------------');

    // Get token
    try {
      console.log('Call to get token');

      const userToken = await getUserTokenAsync();
      console.log(`User token: ${userToken}`);
    } catch (err) {
      console.log(`Error getting user access token: ${err}`);
    }
    console.log('-------------------------------------------------');
  }
}
