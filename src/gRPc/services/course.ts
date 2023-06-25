import { Observable } from 'rxjs';
import {
  CourseCronjobRequest,
  CoursesResponce,
  GetCourseOfCategoryRequest,
  GetCourseOfMoodleIdRequest,
  GetCourseOfUserRequest,
} from '../interfaces/Course';

export interface GCourseService {
  getUsersCourse(
    userMoodleId: GetCourseOfUserRequest,
  ): Observable<CoursesResponce>;

  getAllCourses({}): Observable<CoursesResponce>;

  getCoursesByCategory(
    categoryMoodleId: GetCourseOfCategoryRequest,
  ): Observable<CoursesResponce>;

  getCoursesByMoodleId(
    courseMoodleId: GetCourseOfMoodleIdRequest,
  ): Observable<CoursesResponce>;

  addCourseCronjob(data: CourseCronjobRequest): Observable<{}>;
}
