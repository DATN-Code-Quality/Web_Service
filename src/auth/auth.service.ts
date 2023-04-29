import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OperationResult } from 'src/common/operation-result';

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
    // if (result.status === 0) {
    //   const payload = { user: result.data };
    //   return OperationResult.ok({
    //     user: result.data,
    //     accessToken: await this.jwtService.signAsync(payload),
    //   });
    // }
    console.log(result);
    return result;
  }
  async generateToken(user: any) {
    const payload = { user: user.data };
    return OperationResult.ok({
      user: user.data,
      accessToken: await this.jwtService.signAsync(payload),
    });
  }
}
