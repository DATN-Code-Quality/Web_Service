import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import {} from 'bcrypt';
import { CategoryService } from './category.service';
import { CategoryResDto } from './res/category-res.dto';
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
}
