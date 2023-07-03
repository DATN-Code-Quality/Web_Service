import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Between, In, Like, Repository } from 'typeorm';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseResDto } from './res/course-res.dto';
import { CourseReqDto } from './req/course-req.dto';
import { UserCourseService } from 'src/user-course/user-course.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { SubmissionService } from 'src/submission/submission.service';
import { ResultService } from 'src/result/result.service';
import { Role, SubRole } from 'src/auth/auth.const';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CourseService extends BaseService<CourseReqDto, CourseResDto> {
  constructor(
    @InjectRepository(CourseReqDto)
    private readonly courseRepository: Repository<CourseReqDto>,
    @Inject(forwardRef(() => UserCourseService))
    private readonly userCourseService: UserCourseService,
    private readonly assignmentService: AssignmentService,
    private readonly submissionService: SubmissionService,
    private readonly resultService: ResultService,
    private readonly userService: UserService,
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
    limit: number,
    offset: number,
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
    if (!courseMin[0]?.startAt || !courseMax[0]?.endAt) {
      return OperationResult.ok({
        total: 0,
        courses: plainToInstance(CourseResDto, [], {
          excludeExtraneousValues: true,
        }),
      });
    }

    let dayMin = courseMin[0].startAt;
    let dayMax = courseMax[0].endAt;

    if (startAt && endAt) {
      dayMin = endAt;
      dayMax = startAt;
    }
    const total = await this.courseRepository.count({
      where: {
        name: Like(`%${name}%`),
        categoryId: categoryId,
        startAt: startAt ? Between(startAt, dayMin) : null,
        endAt: endAt ? Between(dayMax, endAt) : null,
      },
    });

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
        skip: offset,
        take: limit,
      })
      .then((courses) => {
        return OperationResult.ok({
          total: total,
          courses: plainToInstance(CourseResDto, courses, {
            excludeExtraneousValues: true,
          }),
        });
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

  async findCourses(
    courseId: string,
    name: string,
    startAt: Date,
    endAt: Date,
  ) {
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

    if (startAt && endAt) {
      dayMin = endAt;
      dayMax = startAt;
    }

    return await this.courseRepository
      .find({
        order: {
          updatedAt: 'DESC',
        },
        where: {
          id: Like(`%${courseId}%`),
          name: Like(`%${name}%`),
          startAt: startAt ? Between(startAt, dayMin) : null,
          endAt: endAt ? Between(dayMax, endAt) : null,
        },
      })

      .then((courses) => {
        return courses;
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
      .findAssignmentsByCourseId(courseId, '', null, null)
      .then((result) => {
        if (result.isOk()) {
          return result.data.assignments;
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

  async getCoursesByIds(
    ids: string[],
    name: string,
    startAt: Date,
    endAt: Date,
  ): Promise<OperationResult<CourseResDto[]>> {
    //   return this.courseRepository
    //     .createQueryBuilder('course')
    //     .where(
    //       "course.id IN (:...ids) and course.name LIKE '%:name%' and course.startAt >= :startAd and course.endAt <= :endAt and course.deletedAt is null ",
    //       {
    //         ids: ids,
    //         name: name,
    //         // startAt: startAt,
    //         // endAt: endAt,
    //       },
    //     )
    //     .execute()
    //     .then((courses) => {
    //       return OperationResult.ok(courses);
    //     })
    //     .catch((e) => {
    //       return OperationResult.error(e);
    //     });
    // }

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

    if (startAt && endAt) {
      dayMin = endAt;
      dayMax = startAt;
    }

    return await this.courseRepository
      .find({
        order: {
          updatedAt: 'DESC',
        },
        where: {
          // id: Like(`%${courseId}%`),
          id: In(ids),
          name: Like(`%${name}%`),
          startAt: startAt ? Between(startAt, dayMin) : null,
          endAt: endAt ? Between(dayMax, endAt) : null,
        },
      })

      .then((courses) => {
        return OperationResult.ok(courses);
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }

  async getAvgResultInCourse(courseId: string): Promise<OperationResult<any>> {
    const assignments = await this.assignmentService.findAssignmentsByCourseId(
      courseId,
      '',
      null,
      null,
    );

    if (assignments.isOk()) {
      if (assignments.data.assignments.length <= 0) {
        return OperationResult.ok(null);
        //   {
        //   violations: 0,
        //   code_smells: 0,
        //   bugs: 0,
        //   vulnerabilities: 0,
        //   blocker_violations: 0,
        //   critical_violations: 0,
        //   major_violations: 0,
        //   minor_violations: 0,
        //   info_violations: 0,
        //   duplicated_lines_density: 0,
        //   coverage: 0,
        // });
      }

      const assignmentIds = assignments.data.assignments.map((assignment) => {
        return assignment.id;
      });

      const submissions =
        await this.submissionService.getSubmissionsByAssignmentIds(
          assignmentIds,
        );

      if (submissions.isOk()) {
        const submissionIds = submissions.data.map((submission) => {
          return submission.id;
        });

        const result = await this.resultService.getAvgResultsBySubmissionIds(
          submissionIds,
        );

        if (result.isOk()) {
          return OperationResult.ok(result.data);
        } else {
          return OperationResult.error(new Error(`${result.message}`));
        }
      }
    }

    return OperationResult.error(new Error(`${assignments.message}`));
  }

  async getAvgUserResultInCourse(
    courseId: string,
    search: string,
    limit: number,
    offset: number,
  ): Promise<OperationResult<any>> {
    const users = await this.userService.findUserHasSubmissionByCourseId(
      courseId,
      search,
      limit,
      offset,
    );

    if (users.isOk()) {
      const res = [];

      for (let i = 0; i < users.data['users'].length; i++) {
        const submissionIds = users.data['users'][i].submissions.map(
          (submission) => {
            return submission.id;
          },
        );

        const result = await this.resultService.getAvgResultsBySubmissionIds(
          submissionIds,
        );

        if (result.isOk()) {
          res.push({
            user: {
              id: users.data['users'][i].id,
              name: users.data['users'][i].name,
              userId: users.data['users'][i].userId,
              email: users.data['users'][i].email,
            },
            result: result.data,
          });
        }
      }

      return OperationResult.ok({
        total: users.data['total'],
        results: res,
      });
    }

    return OperationResult.error(new Error(`${users.message}`));
  }

  async getAssignmentResultInCourse(
    courseId: string,
    userId: string,
  ): Promise<OperationResult<any>> {
    const assignments = await this.assignmentService.findAssignmentsByCourseId(
      courseId,
      '',
      null,
      null,
    );

    if (assignments.isOk()) {
      const res = [];

      for (let i = 0; i < assignments.data.total; i++) {
        const submission =
          await this.submissionService.findSubmissionsByAssigmentIdAndUserId(
            assignments.data.assignments[i].id,
            userId,
          );

        if (submission.isOk() && submission.data.submissions.length > 0) {
          const result = await this.resultService.getResultBySubmissionId(
            submission.data.submissions[0].id,
          );

          if (result.isOk() && result.data) {
            res.push({
              assignment: assignments.data.assignments[i],
              result: result.data,
            });
          }
        }
      }
      return OperationResult.ok(res);
    }

    return OperationResult.error(new Error(`${assignments.message}`));
  }
}
