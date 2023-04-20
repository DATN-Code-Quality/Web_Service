import { Observable } from 'rxjs';
import { CategoryResponce } from '../interfaces/Category';

export interface GCategoryService {
  getAllCategories({}): Observable<CategoryResponce>;
}
