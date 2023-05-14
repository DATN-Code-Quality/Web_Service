import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { UserCourseReqDto } from './req/user-course-req.dto';
import { UserCourseResDto } from './res/user-course-res.dto';
import { UserResDto } from 'src/user/res/user-res.dto';
import { CourseResDto } from 'src/course/res/course-res.dto';
import { OperationResult } from 'src/common/operation-result';
import { SubRole } from 'src/auth/auth.const';

@Injectable()
export class UserCourseService extends BaseService<
  UserCourseReqDto,
  UserCourseResDto
> {
  constructor(
    @InjectRepository(UserCourseReqDto)
    private readonly usercourseRepository: Repository<UserCourseReqDto>,
  ) {
    super(usercourseRepository);
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
  ): Promise<OperationResult<Array<UserCourseResDto>>> {
    const usercourses = await this.usercourseRepository.find({
      order: {
        user: {
          userId: 'ASC',
        },
      },
      where: {
        courseId: courseId,
        role: role,
      },
      relations: {
        user: true,
      },
    });

    const users = [] as UserResDto[];

    for (let i = 0; i < usercourses.length; i++) {
      usercourses[i].user = plainToInstance(UserResDto, usercourses[i].user, {
        excludeExtraneousValues: true,
      });
    }

    // usercourses.forEach((usercourse) => {
    //   users.push(
    //     plainToInstance(UserResDto, usercourse.user, {
    //       excludeExtraneousValues: true,
    //     }),
    //   );
    // });

    return OperationResult.ok(usercourses);
  }

  async findCoursesByUserId(
    userId: string,
  ): Promise<OperationResult<Array<CourseResDto>>> {
    const usercourses = await this.usercourseRepository.find({
      where: {
        userId: userId,
      },
      relations: {
        course: true,
      },
    });

    const courses = [] as CourseResDto[];

    usercourses.forEach((usercourse) => {
      courses.push(
        plainToInstance(CourseResDto, usercourse.course, {
          excludeExtraneousValues: true,
        }),
      );
    });

    return OperationResult.ok(courses);
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
  ): Promise<OperationResult<UserCourseResDto>> {
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

    const savedUsers = await this.findUsersByCourseId(courseId, null);
    if (savedUsers.isOk()) {
      usercourses = usercourses.filter((usercourse) => {
        const isExist = savedUsers.data.some(
          (savedUser) => savedUser.id === usercourse.userId,
        );
        return isExist == false ? usercourse : null;
      });
    }
    return await this.createMany(UserCourseResDto, usercourses);
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
