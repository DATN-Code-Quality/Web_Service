import { Injectable } from '@nestjs/common';
import { UserReqDto } from './req/user-req.dto';
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
  ): Promise<OperationResult<UserReqDto>> {
    let result: OperationResult<any>;
    await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId and user.password = :password', {
        userId: userId,
        password: password,
      })
      .getOne()
      .then((savedDtos) => {
        result = OperationResult.ok(
          plainToInstance(UserReqDto, savedDtos, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async addUsers(users: UserReqDto[]): Promise<OperationResult<UserReqDto>> {
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
}
