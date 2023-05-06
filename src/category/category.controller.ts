import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryResDto } from './res/category-res.dto';
import { CategoryReqDto } from './req/category-req.dto';
import { Role } from 'src/auth/auth.const';
import { Roles } from 'src/auth/auth.decorator';
@ApiTags('Category')
@Controller('/api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get('/categories')
  async getAllCategorys() {
    const result = await this.categoryService.findAll(CategoryResDto);
    return result;
  }

  @Roles(Role.ADMIN)
  @Post('/')
  async addCategories(
    @Body(new ParseArrayPipe({ items: CategoryReqDto }))
    categories: CategoryReqDto[],
  ) {
    const result = await this.categoryService.createMany(
      CategoryResDto,
      categories,
    );
    return result;
  }
}
