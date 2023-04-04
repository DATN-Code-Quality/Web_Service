import { Observable } from 'rxjs';
import { CoursesResponce, GetCourseOfUserRequest } from '../interfaces/Course';

export interface CourseService {
  getUsersCourse(userMoodleId: GetCourseOfUserRequest): Observable<CoursesResponce>;
}
