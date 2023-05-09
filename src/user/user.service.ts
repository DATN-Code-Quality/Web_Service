import { Injectable } from '@nestjs/common';
import { STATUS, UserReqDto } from './req/user-req.dto';
import { BaseService } from 'src/common/base.service';
import { UserResDto } from './res/user-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { SALTROUNDS } from './user.controller';

@Injectable()
export class UserService extends BaseService<UserReqDto, UserResDto> {
  constructor(
    @InjectRepository(UserReqDto)
    private readonly userRepository: Repository<UserReqDto>, // @Inject(UsersCoursesService) private readonly usersCoursesService: UsersCoursesService,
  ) {
    super(userRepository);
  }

  async findUserByUsernameAndPassword(
    userId: string,
    password: string,
  ): Promise<OperationResult<UserResDto | any>> {
    // let result: OperationResult<any>;
    return await this.userRepository
      .createQueryBuilder('user')
      // .where('user.userId = :userId and user.password = :password', {
      //   userId: userId,
      //   password: password,
      // })
      .where('user.userId = :userId', {
        userId: userId,
      })
      .getOne()
      .then((savedDtos) => {
        if (savedDtos) {
          return bcrypt
            .compare(password, savedDtos.password)
            .then((isValid) => {
              if (isValid) {
                if (savedDtos.status === STATUS.BLOCK) {
                  return OperationResult.error(
                    Error('Account has been blocked'),
                  );
                }
                if (savedDtos.status === STATUS.INACTIVE) {
                  return OperationResult.error(
                    Error('Account has not been actived'),
                  );
                }
                return OperationResult.ok(
                  plainToInstance(UserResDto, savedDtos, {
                    excludeExtraneousValues: true,
                  }),
                );
              } else {
                return OperationResult.error(Error('Invalid password'));
              }
            })
            .catch((err) => {
              return OperationResult.error(err);
            });
        } else {
          return OperationResult.error(Error('InValid username'));
        }
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async addUsers(users: UserReqDto[]): Promise<OperationResult<UserResDto>> {
    const salt = await bcrypt.genSalt(SALTROUNDS);
    const hash = users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password || '1234', salt);
      return {
        ...user,
        password: hashedPassword,
      };
    });
    const usersAdded = [] as UserReqDto[];
    for (let i = 0; i < hash.length; i++) {
      usersAdded.push(await hash[i]);
    }
    const result = await this.createMany(UserResDto, usersAdded);
    return result;
  }

  async updateUser(
    userId: string,
    user: UserReqDto,
  ): Promise<OperationResult<UserResDto>> {
    const salt = await bcrypt.genSalt(SALTROUNDS);
    if (user.password !== null && user.password !== '') {
      console.log('Change password');
      user.password = await bcrypt.hash(user.password || '1234', salt);
    }

    const result = await this.update(userId, user);
    return result;
  }

  // async findUserByCourseId(courseId: string): Promise<OperationResult<Array<UserReqDto>>> {
  //   const userscourse = await this.usersCoursesService.findUserCoursesByCourseId(courseId)
  //   if (userscourse.length == 0){
  //     return OperationResult.ok([]);
  //   }

  //   const ids = userscourse.map((usercourse) => usercourse.userId)

  //   var result: OperationResult<Array<UserReqDto>>

  //   await this.userRepository.createQueryBuilder("user")
  //     .where("user.id IN (:...ids) and user.deletedAt is null", { ids: ids }).getMany()
  //     .then((users) => {
  //       result = OperationResult.ok(plainToInstance(UserReqDto, users, { excludeExtraneousValues: true }))
  //     })
  //     .catch((err) => {
  //       result = OperationResult.error(err)
  //     })
  //   return result
  // }

  // async addUsers(users: UserReqDto[]) {}
  // async updateUser(user: UserReqDto, userId: string) {}
  // async deleteUser(userId: string) {}

  async changePassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt(SALTROUNDS);
    const hashedPassword = await bcrypt.hash(password || '1234', salt);
    return await this.userRepository
      .update(userId, { password: hashedPassword })
      .then((result) => {
        console.log(result);
        return OperationResult.ok('Update successfully');
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async changeStatus(ids: string[], status: STATUS) {
    if (status < 0 || status > 2) {
      return OperationResult.error(new Error('Status is not valid'));
    }

    return await this.userRepository
      .createQueryBuilder()
      .update(UserReqDto)
      .set({ status: status })
      .where('user.id IN (:...ids) and user.deletedAt is null', { ids: ids })
      .execute()
      .then(() => {
        return OperationResult.ok('Update status successfully');
      })
      .catch((e) => {
        return OperationResult.error(e);
      });
  }

  async activeAccount(userId: string) {
    return await this.userRepository
      .createQueryBuilder()
      .update(UserReqDto)
      .set({ status: STATUS.ACTIVE })
      .where('user.id = :id and user.deletedAt is null', { id: userId })
      .execute()
      .then(() => {
        return OperationResult.ok('Active account successfully');
      })
      .catch((e) => {
        return OperationResult.error(e);
      });
  }
}
