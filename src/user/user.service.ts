import { Body, Injectable } from '@nestjs/common';
import { USER_STATUS, UserReqDto } from './req/user-req.dto';
import { BaseService } from 'src/common/base.service';
import { UserResDto } from './res/user-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { Like, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { SALTROUNDS } from './user.controller';
import { Role } from 'src/auth/auth.const';
import { User } from 'src/gRPc/interfaces/User';

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
                if (savedDtos.status === USER_STATUS.BLOCK) {
                  return OperationResult.error(
                    Error('Account has been blocked'),
                  );
                }
                if (savedDtos.status === USER_STATUS.INACTIVE) {
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

  async addUsers(users: UserReqDto[]): Promise<OperationResult<UserResDto[]>> {
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
        return OperationResult.ok('Update successfully');
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async changeStatus(ids: string[], status: USER_STATUS) {
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
      .set({ status: USER_STATUS.ACTIVE })
      .where('user.id = :id and user.deletedAt is null', { id: userId })
      .execute()
      .then(() => {
        return OperationResult.ok('Active account successfully');
      })
      .catch((e) => {
        return OperationResult.error(e);
      });
  }

  async findAllUsers(name: string, userId: string, role: string) {
    return await this.userRepository
      .find({
        order: {
          userId: 'ASC',
        },
        where: {
          name: Like(`%${name}%`),
          userId: Like(`%${userId}%`),
          role: role,
        },
      })

      .then((users) => {
        return OperationResult.ok(
          plainToInstance(UserResDto, users, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async upsertUsers(users: User[]) {
    console.log(users);
    const moodleIds = users.map((user) => {
      return user.moodleId;
    });

    const savedUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.moodleId IN (:...moodleIds) and user.deletedAt is null', {
        moodleIds: moodleIds,
      })
      .getMany()
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return [];
      });

    const insertUser = [];
    const updatedUserIds = [];

    for (let j = 0; j < users.length; j++) {
      let isExist = false;
      users[j].role = Role.USER;

      for (let i = 0; i < savedUsers.length; i++) {
        if (users[j].moodleId == savedUsers[i].moodleId) {
          users[j].status = USER_STATUS.ACTIVE;

          await this.userRepository
            .update(savedUsers[i].id, users[j])
            .catch((e) => {
              return OperationResult.error(
                new Error(`Can not import users: ${e.message}`),
              );
            });
          isExist = true;
          updatedUserIds.push(savedUsers[i].id);
          break;
        }
      }
      if (!isExist) {
        insertUser.push(users[j]);
      }
    }

    const insertResult = await this.addUsers(insertUser);

    if (insertResult.isOk()) {
      if (updatedUserIds.length > 0) {
        return this.userRepository
          .createQueryBuilder('user')
          .where('user.id IN (:...ids) and user.deletedAt is null', {
            ids: updatedUserIds,
          })
          .getMany()
          .then((upsertedUsers) => {
            const userRes = plainToInstance(UserResDto, upsertedUsers, {
              excludeExtraneousValues: true,
            });
            insertResult.data.forEach((user) => {
              userRes.push(user);
            });
            return OperationResult.ok(userRes);
          })
          .catch((e) => {
            return OperationResult.error(new Error(e));
          });
      } else {
        return insertResult;
      }
    } else {
      return OperationResult.error(
        new Error(`Can not import users: ${insertResult.message}`),
      );
    }
  }
}
