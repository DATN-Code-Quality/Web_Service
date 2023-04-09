import { Observable } from 'rxjs';
import { CategoryResponce } from '../interfaces/Category';

export interface CategoryService {
  getAllCategories({}): Observable<CategoryResponce>;
}
