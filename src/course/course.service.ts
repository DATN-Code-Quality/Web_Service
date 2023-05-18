import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Between, Like, Repository } from 'typeorm';
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
    @Inject(forwardRef(() => UserCourseService))
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
    startAt: Date,
    endAt: Date,
  ): Promise<OperationResult<any>> {
    const [courseMin, courseMax] = await Promise.all([
      this.courseRepository.find({
        order: {
          startAt: 'DESC',
        },
      }),
      this.courseRepository.find({
        order: {
          endAt: 'ASC',
        },
      }),
    ]);

    let dayMin = courseMin[0].startAt;
    let dayMax = courseMax[0].endAt;
    console.log(startAt);
    console.log(dayMin);
    console.log(startAt > dayMin);

    if (startAt && endAt) {
      dayMin = endAt;
      dayMax = startAt;
    }
    console.log({ startAt, endAt, dayMin, dayMax });

    return await this.courseRepository
      .find({
        order: {
          updatedAt: 'DESC',
        },
        where: {
          name: Like(`%${name}%`),
          categoryId: categoryId,
          startAt: startAt ? Between(startAt, dayMin) : null,
          endAt: endAt ? Between(dayMax, endAt) : null,
        },
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

  async findCourseById(courseId: string): Promise<OperationResult<any>> {
    return await this.courseRepository
      .findBy({
        id: courseId,
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

  async upsertCourses(courses: CourseReqDto[]): Promise<any> {
    const moodleIds = courses.map((course) => {
      return course.courseMoodleId;
    });

    const savedCourses = await this.courseRepository
      .createQueryBuilder('course')
      .where(
        'course.courseMoodleId IN (:...moodleIds) and course.deletedAt is null',
        {
          moodleIds: moodleIds,
        },
      )
      .getMany()
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return [];
      });

    const insertCourses = [];
    const updatedCourseIds = [];

    for (let j = 0; j < courses.length; j++) {
      let isExist = false;
      for (let i = 0; i < savedCourses.length; i++) {
        if (courses[j].courseMoodleId == savedCourses[i].courseMoodleId) {
          await this.courseRepository
            .update(savedCourses[i].id, courses[j])
            .catch((e) => {
              return OperationResult.error(
                new Error(`Can not import course: ${e.message}`),
              );
            });
          isExist = true;
          updatedCourseIds.push(savedCourses[i].id);
          break;
        }
      }
      if (!isExist) {
        insertCourses.push(courses[j]);
      }
    }

    const insertResult = await this.createMany(CourseResDto, insertCourses);
    if (insertResult.isOk()) {
      if (updatedCourseIds.length > 0) {
        return this.courseRepository
          .createQueryBuilder('course')
          .where('course.id IN (:...id) and course.deletedAt is null', {
            id: updatedCourseIds,
          })
          .getMany()
          .then((upsertedCourses) => {
            insertResult.data.forEach((course) => {
              upsertedCourses.push(course);
            });

            return OperationResult.ok(
              plainToInstance(CourseResDto, upsertedCourses, {
                excludeExtraneousValues: true,
              }),
            );
          })
          .catch((e) => {
            return OperationResult.error(new Error(e));
          });
      } else {
        return insertResult;
      }
    } else {
      return OperationResult.error(
        new Error(`Can not import courses: ${insertResult.message}`),
      );
    }
  }
}
