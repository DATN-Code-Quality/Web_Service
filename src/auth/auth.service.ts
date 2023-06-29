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
import { UserResDto } from 'src/user/res/user-res.dto';
import { USER_STATUS, UserReqDto } from 'src/user/req/user-req.dto';

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
    const token = await this.jwtService.signAsync(payload);

    let isFirstTime = false;
    if (user.data.status === USER_STATUS.INACTIVE) {
      await this.usersService.changeStatus([user.data.id], USER_STATUS.ACTIVE);
      isFirstTime = true;
    }
    return OperationResult.ok({
      user: user.data,
      accessToken: {
        token: token,
        expiredAt: this.jwtService.decode(token)['exp'],
      },
      isFirstTime: isFirstTime,
    });
  }

  async loginWithOutlook(token: string) {
    try {
      const payload = this.jwtService.decode(token);
      const email = payload['upn'];

      if (payload['exp'] * 1000 < Date.now()) {
        return OperationResult.error(new Error('token has expired'));
      }

      if (email) {
        const user = await this.usersService.findUserByEmail(email);

        if (user.isOk()) {
          const accessToken = await this.jwtService.signAsync({
            user: user.data,
          });

          let isFirstTime = false;
          if (user.data.status === USER_STATUS.INACTIVE) {
            await this.usersService.changeStatus(
              [user.data.id],
              USER_STATUS.ACTIVE,
            );
            isFirstTime = true;
          }

          return OperationResult.ok({
            user: user.data,
            accessToken: {
              token: accessToken,
              expiredAt: this.jwtService.decode(accessToken)['exp'],
            },
            isFirstTime: isFirstTime,
          });
        } else {
          return user;
        }
      }
    } catch (e) {
      return OperationResult.error(new Error('invalid token'));
    }
    return OperationResult.error(new Error('login fail'));

    // if(payload)
  }

  async changePassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.decode(token);

      if (payload['exp'] * 1000 < Date.now()) {
        return OperationResult.error(new Error('Token has expired'));
      }

      const user = await this.usersService.findOne(
        UserResDto,
        payload['userId'],
      );

      if (user.isOk()) {
        if (user.data.status === USER_STATUS.INACTIVE) {
          return OperationResult.ok(
            'Account has not been actived, can not change password',
          );
        }
        if (user.data.status === USER_STATUS.BLOCK) {
          return OperationResult.error(
            new Error('Account has been blocked, can not change password'),
          );
        }

        return await this.usersService.changePassword(
          payload['userId'],
          newPassword,
        );
      }
    } catch (e) {
      return OperationResult.error(new Error('Token is invalid'));
    }
  }
}
