import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryReqDto } from './req/category-req.dto';
import { CategoryResDto } from './res/category-res.dto';

@Injectable()
export class CategoryService extends BaseService<
  CategoryReqDto,
  CategoryResDto
> {
  constructor(
    @InjectRepository(CategoryReqDto)
    private readonly categoryRepository: Repository<CategoryReqDto>,
  ) {
    super(categoryRepository);
  }
}
