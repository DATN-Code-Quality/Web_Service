import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Like, Repository } from 'typeorm';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseResDto } from './res/course-res.dto';
import { CourseReqDto } from './req/course-req.dto';
import { UserCourseService } from 'src/user-course/user-course.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { SubmissionService } from 'src/submission/submission.service';

@Injectable()
export class CourseService extends BaseService<CourseReqDto, CourseResDto> {
  constructor(
    @InjectRepository(CourseReqDto)
    private readonly courseRepository: Repository<CourseReqDto>,
    private readonly userCourseService: UserCourseService,
    private readonly assignmentService: AssignmentService,
    private readonly submissionService: SubmissionService,
  ) {
    super(courseRepository);
  }

  async findCoursesByCategoryId(
    categoryId: string,
  ): Promise<OperationResult<Array<CourseResDto>>> {
    return await this.courseRepository
      .createQueryBuilder('course')
      .where('course.categoryId = :categoryId and course.deletedAt is null', {
        categoryId: categoryId,
      })
      .getMany()
      .then((courses) => {
        return OperationResult.ok(
          plainToInstance(CourseResDto, courses, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async findAllCourses(
    categoryId: string,
    name: string,
  ): Promise<OperationResult<any>> {
    return await this.courseRepository
      .findBy({
        name: Like(`%${name}%`),
        categoryId: categoryId,
      })

      .then((courses) => {
        return OperationResult.ok(
          plainToInstance(CourseResDto, courses, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  // async findCoursesByUserId(userId: string): Promise<OperationResult<Array<CourseDto>>> {
  //   const usercourses = await this.usersCoursesService.findUserCoursesByUserId(userId)
  //   if (usercourses.length == 0){
  //     return OperationResult.ok([]);
  //   }
  //   const ids = usercourses.map((usercourse) => usercourse.courseId)
  //   var result: OperationResult<Array<CourseDto>>

  //   await this.courseRepository.createQueryBuilder("course")
  //     .where("course.id IN (:...ids) and course.deletedAt is null", { ids: ids })
  //     .getMany()
  //     .then((courses) => {
  //       result = OperationResult.ok(plainToInstance(CourseDto, courses, { excludeExtraneousValues: true }))
  //     })
  //     .catch((err) => {
  //       result = OperationResult.error(err)
  //     })
  //   return result
  // }

  async getReport(courseId: string) {
    const studentTotal =
      await this.userCourseService.countStudentTotalByCourseId(courseId);

    const assignments = await this.assignmentService
      .findAssignmentsByCourseId(courseId)
      .then((result) => {
        if (result.isOk()) {
          return result.data;
        } else {
          return [];
        }
      });

    const result = [];

    for (let i = 0; i < assignments.length; i++) {
      result.push({
        assignment: {
          id: assignments[i].id,
          name: assignments[i].name,
        },
        submission:
          await this.submissionService.countSubmissionByAssignmentIdAndGroupByStatus(
            assignments[i].id,
          ),
      });
    }

    return await OperationResult.ok({
      total: studentTotal,
      assignment: result,
    });
  }
}
