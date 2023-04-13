import { Observable } from 'rxjs';
import {
  CoursesResponce,
  GetCourseOfCategoryRequest,
  GetCourseOfMoodleIdRequest,
  GetCourseOfUserRequest,
} from '../interfaces/Course';

export interface CourseService {
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
}
