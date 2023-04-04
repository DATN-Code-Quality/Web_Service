import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { UserCourseReqDto } from './req/user-course-req.dto';
import { UserCourseResDto } from './res/user-course-res.dto';

@Injectable()
export class UserCourseService extends BaseService<UserCourseReqDto, UserCourseResDto> {
  constructor(
    @InjectRepository(UserCourseReqDto) private readonly usercourseRepository: Repository<UserCourseReqDto>
  ) {
    super(usercourseRepository)
  }

  async findUserCoursesByUserId(userId: string): Promise<Array<UserCourseResDto>> {

    const courses = await this.usercourseRepository.createQueryBuilder("user_course")
      .where("user_course.userId = :userId and user_course.deletedAt is null", { userId: userId }).getMany()

    return plainToInstance(UserCourseResDto, courses, {
      excludeExtraneousValues: true
    })
  }

  async findUserCoursesByCourseId(courseId: string): Promise<Array<UserCourseResDto>> {
    const courses = await this.usercourseRepository.createQueryBuilder("user_course")
      .where("user_course.courseId = :courseId and user_course.deletedAt is null", { courseId: courseId }).getMany()
    console.log(courses)

    return plainToInstance(UserCourseResDto, courses, {
      excludeExtraneousValues: true
    })
  }



}
