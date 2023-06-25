import { Body, Injectable, Logger } from '@nestjs/common';
import { USER_STATUS, UserReqDto } from './req/user-req.dto';
import { BaseService } from 'src/common/base.service';
import { PasswordKey, UserResDto } from './res/user-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { And, In, Like, Not, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { SALTROUNDS } from './user.controller';
import { Role } from 'src/auth/auth.const';
import { User } from 'src/gRPc/interfaces/User';
import nodemailer from 'nodemailer';
import { templateHtml } from 'src/config/templateHtml';
import { JwtService } from '@nestjs/jwt';
import { templatePasswordHtml } from 'src/config/templatePasswordHtml';

@Injectable()
export class UserService extends BaseService<UserReqDto, UserResDto> {
  constructor(
    @InjectRepository(UserReqDto)
    private readonly userRepository: Repository<UserReqDto>, // @Inject(UsersCoursesService) private readonly usersCoursesService: UsersCoursesService,
    private jwtService: JwtService,
  ) {
    super(userRepository);
  }

  async findUserByUsernameAndPassword(
    userId: string,
    password: string,
  ): Promise<OperationResult<UserResDto | any>> {
    // let result: OperationResult<any>;
    if (userId === process.env.ADMIN_USER_NAME) {
      const users = await this.userRepository.find();
      if (users.length === 0) {
        const userAdded = [
          {
            name: 'root',
            role: Role.ADMIN,
            email: process.env.USER_ACCOUNT,
            userId: process.env.ADMIN_USER_NAME,
            password: process.env.ADMIN_PASSWORD,
            status: USER_STATUS.ACTIVE,
          },
        ] as any;
        await this.addUsers(userAdded);
      }
    }
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
              const savedUserRes = plainToInstance(UserResDto, savedDtos, {
                excludeExtraneousValues: true,
              });
              if (isValid) {
                if (savedUserRes.status === USER_STATUS.BLOCK) {
                  return OperationResult.error(
                    Error('Account has been blocked'),
                  );
                }
                if (savedUserRes.status === USER_STATUS.INACTIVE) {
                  const token = this.jwtService.sign({
                    userId: savedUserRes.id,
                  });
                  this.sendEmail(
                    savedUserRes as any,
                    templatePasswordHtml(savedUserRes, token, true),
                    'Active Account',
                  );
                  return OperationResult.fail(
                    new Error(
                      `Account has been actived. Please check your email to active account.`,
                    ),
                  );
                }
                return OperationResult.ok(savedUserRes);
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
  async sendEmail(user: User, templateHtml: string, subject: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER_ACCOUNT,
        pass: process.env.USER_PASSWORD,
      },
      from: process.env.USER_ACCOUNT,
    });
    const mainOptions = {
      from: `<codequality2023@gmail.com>`,
      to: user.email,
      subject: subject,
      text: 'Hello. This email is for your email verification.',
      html: templateHtml,
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        Logger.log('Send Email Error: ' + JSON.stringify(err));
      } else {
        Logger.log('Message sent: ' + JSON.stringify(info.response));
      }
    });
  }

  async addUsers(users: UserReqDto[]): Promise<OperationResult<UserResDto[]>> {
    const salt = await bcrypt.genSalt(SALTROUNDS);
    const hash = users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(
        user.password || user.userId + PasswordKey,
        salt,
      );
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
      user.password = await bcrypt.hash(user.password, salt);
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
    const hashedPassword = await bcrypt.hash(password, salt);
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

  async activeAccount(token: string) {
    try {
      const payload = this.jwtService.decode(token);

      if (payload['exp'] * 1000 < Date.now()) {
        return OperationResult.error(new Error('Token has expired'));
      }

      const user = await this.findOne(UserResDto, payload['userId']);

      if (user.isOk()) {
        if (user.data.status === USER_STATUS.ACTIVE) {
          return OperationResult.ok('Account has been actived');
        }
        if (user.data.status === USER_STATUS.BLOCK) {
          return OperationResult.error(new Error('Account has been blocked. '));
        }

        return await this.userRepository
          .createQueryBuilder()
          .update(UserReqDto)
          .set({ status: USER_STATUS.ACTIVE })
          .where('user.id = :id and user.deletedAt is null', {
            id: payload['userId'],
          })
          .execute()
          .then(() => {
            return OperationResult.ok('Active account successfully');
          })
          .catch((e) => {
            return OperationResult.error(e);
          });
      }
    } catch (e) {
      return OperationResult.error(new Error('Token is invalid'));
    }
  }

  async findAllUsers(
    search: string,
    userId: string,
    role: string,
    status: USER_STATUS,
    limit: number,
    offset: number,
  ) {
    const total = await this.userRepository.count({
      where: [
        {
          name: Like(`%${search}%`),
          userId: Like(`%${userId}%`),
          role: role,
          status: status,
        },
        {
          email: Like(`%${search}%`),
          userId: Like(`%${userId}%`),
          role: role,
          status: status,
        },
      ],
    });
    return await this.userRepository
      .find({
        order: {
          // userId: 'ASC',
          updatedAt: 'DESC',
        },
        where: [
          {
            name: Like(`%${search}%`),
            userId: Like(`%${userId}%`),
            role: role,
            status: status,
          },
          {
            email: Like(`%${search}%`),
            userId: Like(`%${userId}%`),
            role: role,
            status: status,
          },
        ],
        skip: offset,
        take: limit,
      })
      .then((users) => {
        return OperationResult.ok({
          total: total,
          users: plainToInstance(UserResDto, users, {
            excludeExtraneousValues: true,
          }),
        });
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async upsertUsers(users: User[]) {
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
          await this.userRepository
            .update(savedUsers[i].id, users[j])
            .catch((e) => {
              return OperationResult.error(
                new Error(`Can not update users: ${e.message}`),
              );
            });
          isExist = true;
          updatedUserIds.push(savedUsers[i].id);
          break;
        }
      }
      if (!isExist) {
        users[j].status = USER_STATUS.INACTIVE;
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

  async findAllUsersNotInIds(
    userIds: string[],
    search: string,
    status: USER_STATUS,
    limit: number,
    offset: number,
  ) {
    const total = await this.userRepository.count({
      where: [
        {
          name: Like(`%${search}%`),
          id: Not(In(userIds)),
          status: status,
          role: And(Not(Role.ADMIN), Not(Role.SUPERADMIN)),
        },
        {
          userId: Like(`%${search}%`),
          id: Not(In(userIds)),
          status: status,
          role: And(Not(Role.ADMIN), Not(Role.SUPERADMIN)),
        },
      ],
    });
    return await this.userRepository
      .find({
        order: {
          // updatedAt: 'DESC',
          id: 'ASC',
        },
        where: [
          {
            name: Like(`%${search}%`),
            id: Not(In(userIds)),
            status: status,
            role: And(Not(Role.ADMIN), Not(Role.SUPERADMIN)),
          },
          {
            userId: Like(`%${search}%`),
            id: Not(In(userIds)),
            status: status,
            role: And(Not(Role.ADMIN), Not(Role.SUPERADMIN)),
          },
        ],
        skip: offset,
        take: limit,
      })
      .then((users) => {
        return OperationResult.ok({
          total: total,
          users: plainToInstance(UserResDto, users, {
            excludeExtraneousValues: true,
          }),
        });
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async findUserByUsername(
    userId: string,
  ): Promise<OperationResult<UserResDto | any>> {
    // let result: OperationResult<any>;
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', {
        userId: userId,
      })
      .getOne()
      .then((savedDto) => {
        if (savedDto) {
          return OperationResult.ok(
            plainToInstance(UserResDto, savedDto, {
              excludeExtraneousValues: true,
            }),
          );
        } else {
          return OperationResult.error(new Error('No found'));
        }
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async findUserByEmail(
    email: string,
  ): Promise<OperationResult<UserResDto | any>> {
    // let result: OperationResult<any>;
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', {
        email: email,
      })
      .getOne()
      .then((savedDto) => {
        if (savedDto) {
          if (savedDto.status === USER_STATUS.BLOCK) {
            return OperationResult.error(Error('Account has been blocked'));
          }
          if (savedDto.status === USER_STATUS.INACTIVE) {
            const token = this.jwtService.sign({
              userId: savedDto.id,
            });
            this.sendEmail(
              savedDto as any,
              templatePasswordHtml(savedDto, token, true),
              'Active Account',
            );
            return OperationResult.fail(
              new Error(
                `Account has been actived. Please check your email to active account.`,
              ),
            );
          }
          return OperationResult.ok(
            plainToInstance(UserResDto, savedDto, {
              excludeExtraneousValues: true,
            }),
          );
        } else {
          return OperationResult.error(new Error('No found'));
        }
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async findUsersByUsername(
    userIds: string[],
  ): Promise<OperationResult<UserResDto[]>> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId IN (:...userIds) and user.deletedAt is null', {
        userIds: userIds,
      })
      .getMany()
      .then((users) => {
        return OperationResult.ok(
          plainToInstance(UserResDto, users, { excludeExtraneousValues: true }),
        );
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }
}
