import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { CategoryService } from './category.service';
import { CategoryResDto } from './res/category-res.dto';
import { CategoryReqDto } from './req/category-req.dto';
const SALTROUNDS = 10;
@ApiTags('Category')
@Controller('/api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/get-all-category')
  async getAllCategorys() {
    const result = await this.categoryService.findAll(CategoryResDto);
    return result;
  }

  @Post('/create-categories')
  async addCategories(@Body() categories: CategoryReqDto[]) {
    const result = await this.categoryService.createMany(
      CategoryResDto,
      categories,
    );
    return result;
  }
}
