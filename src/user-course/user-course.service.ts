import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { Like, Repository } from 'typeorm';
import { UserCourseReqDto } from './req/user-course-req.dto';
import { UserCourseResDto } from './res/user-course-res.dto';
import { UserResDto } from 'src/user/res/user-res.dto';
import { CourseResDto } from 'src/course/res/course-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { SubRole } from 'src/auth/auth.const';
import { GUserService } from 'src/gRPc/services/user';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/common/service-response';
import { CourseReqDto } from 'src/course/req/course-req.dto';
import { CourseService } from 'src/course/course.service';
import { USER_STATUS } from 'src/user/req/user-req.dto';

@Injectable()
export class UserCourseService extends BaseService<
  UserCourseReqDto,
  UserCourseResDto
> {
  private gUserMoodleService: GUserService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
    @InjectRepository(UserCourseReqDto)
    private readonly usercourseRepository: Repository<UserCourseReqDto>,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {
    super(usercourseRepository);
  }

  onModuleInit() {
    this.gUserMoodleService =
      this.client.getService<GUserService>('GUserService');
  }

  async getUsersByCourseMoodleId(courseMoodleId: number) {
    const response$ = this.gUserMoodleService
      .getUsersByCourseMoodleId({
        courseMoodleId,
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    // 6 is error in third party with no participant in this course
    if (resultDTO?.error == 6) {
      resultDTO.error = 0;
      resultDTO.data = [];
    }
    return resultDTO;
  }

  async findUserCoursesByUserId(
    userId: string,
  ): Promise<Array<UserCourseResDto>> {
    const courses = await this.usercourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.userId = :userId and user_course.deletedAt is null', {
        userId: userId,
      })
      .getMany();

    return plainToInstance(UserCourseResDto, courses, {
      excludeExtraneousValues: true,
    });
  }

  async findUsersByCourseId(
    courseId: string,
    role: string,
    search: string,
    status: USER_STATUS,
    limit: number,
    offset: number,
  ): Promise<OperationResult<any>> {
    const usercourses = await this.usercourseRepository.find({
      order: {
        user: {
          userId: 'ASC',
        },
      },
      where: {
        courseId: courseId,
        role: role,
        user: [
          {
            status: status,
            name: Like(`%${search}%`),
          },
          {
            status: status,
            email: Like(`%${search}%`),
          },
        ],
      },
      relations: {
        user: true,
      },
      skip: offset,
      take: limit,
    });

    const total = await this.usercourseRepository.count({
      order: {
        user: {
          userId: 'ASC',
        },
      },
      where: {
        courseId: courseId,
        role: role,
        user: [
          {
            status: status,
            name: Like(`%${search}%`),
          },
          {
            status: status,
            email: Like(`%${search}%`),
          },
        ],
      },
    });

    const users = [] as UserResDto[];

    for (let i = 0; i < usercourses.length; i++) {
      usercourses[i].user = plainToInstance(UserResDto, usercourses[i].user, {
        excludeExtraneousValues: true,
      });

      usercourses[i].user.role = usercourses[i].role;

      users.push(usercourses[i].user);
    }

    return OperationResult.ok({
      total: total,
      users: users,
    });
  }

  async findCoursesByUserId(
    userId: string,
    role: string,
    name: string,
    startAt: Date,
    endAt: Date,
    limit: number,
    offset: number,
  ): Promise<OperationResult<any>> {
    const usercourses = await this.usercourseRepository.find({
      where: {
        userId: userId,
        role: role,
      },
      skip: offset,
      take: limit,
    });

    const total = await this.usercourseRepository.count({
      where: {
        userId: userId,
        role: role,
      },
    });

    const courseIds = usercourses.map((usercourse) => usercourse.courseId);
    // return await this.courseService.getCoursesByIds(courseIds, name, startAt, endAt);
    const courses = await this.courseService.getCoursesByIds(
      courseIds,
      name,
      startAt,
      endAt,
    );

    if (courses.isOk()) {
      return OperationResult.ok({
        total: total,
        courses: courses.data,
      });
    } else {
      return courses;
    }
    // const courses = await this.usercourseRepository.createQueryBuilder('course')
    // .where('course.id IN (:...ids) and course.deletedAt is null', {
    //   ids: courseIds,
    // })
    // .getMany()
    // .then((upsertedCategories) => {
    //   insertResult.data.forEach((category) => {
    //     upsertedCategories.push(category);
    //   });
    //   return OperationResult.ok(
    //     plainToInstance(CategoryResDto, upsertedCategories, {
    //       excludeExtraneousValues: true,
    //     }),
    //   );
    // })
    // .catch((e) => {
    //   return OperationResult.error(new Error(e));
    // });

    // const promiseCourses = await Promise.all(
    //   usercourses.map(async (usercourse) => {
    //     return await this.courseService.findCourses(
    //       usercourse.courseId,
    //       name,
    //       startAt,
    //       endAt,
    //     );
    //   }),
    // );
    // const courses = promiseCourses.filter(
    //   (promiseCourse) => promiseCourse[0] != null,
    // );

    // return OperationResult.ok(
    //   plainToInstance(CourseResDto, courses, {
    //     excludeExtraneousValues: true,
    //   }),
    // );
  }

  async findUserCoursesByCourseIdAndUserId(
    courseId: string,
    userId: string,
  ): Promise<UserCourseResDto> {
    const courses = await this.usercourseRepository
      .createQueryBuilder('user_course')
      .where(
        'user_course.courseId = :courseId and user_course.userId = :userId and user_course.deletedAt is null',
        { courseId: courseId, userId: userId },
      )
      .getOne();

    return plainToInstance(UserCourseResDto, courses, {
      excludeExtraneousValues: true,
    });
  }

  async addUsersIntoCourse(
    courseId: string,
    studentRoleIds: string[],
    teacherRoleIds: string[],
  ): Promise<OperationResult<UserCourseResDto[]>> {
    let usercourses = [] as UserCourseReqDto[];

    if (studentRoleIds) {
      studentRoleIds.forEach((studentId) => {
        usercourses.push(UserCourseReqDto.Student(courseId, studentId));
      });
    }

    if (teacherRoleIds) {
      teacherRoleIds.forEach((teacherId) => {
        usercourses.push(UserCourseReqDto.Teacher(courseId, teacherId));
      });
    }

    const savedUserCourses = await this.usercourseRepository.find({
      where: {
        courseId: courseId,
      },
    });

    if (savedUserCourses.length > 0) {
      const insertUserCourses = [];
      for (let j = 0; j < usercourses.length; j++) {
        let isExist = false;
        for (let i = 0; i < savedUserCourses.length; i++) {
          if (usercourses[j].userId === savedUserCourses[i].userId) {
            await this.update(savedUserCourses[i].id, usercourses[j]);
            isExist = true;
            break;
          }
        }

        if (!isExist) {
          insertUserCourses.push(usercourses[j]);
        }
      }
      await this.createMany(UserCourseResDto, insertUserCourses);
    } else {
      await this.createMany(UserCourseResDto, usercourses);
    }
    return await this.usercourseRepository
      .createQueryBuilder('user_course')
      .where(
        'user_course.userId IN (:...studentIds) OR user_course.userId IN (:...teacherIds)  and user_course.deletedAt is null',
        {
          studentIds: studentRoleIds,
          teacherIds: teacherRoleIds,
        },
      )
      .getMany()
      .then((data) => {
        return OperationResult.ok(
          plainToInstance(UserCourseResDto, data, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((e) => {
        return OperationResult.error(new Error(e));
      });
  }

  async countStudentTotalByCourseId(courseId: string): Promise<number> {
    return await this.usercourseRepository.count({
      where: {
        courseId: courseId,
        role: SubRole.STUDENT,
      },
    });
  }
}
