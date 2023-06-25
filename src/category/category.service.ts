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

  async upsertCategories(categories: CategoryReqDto[]) {
    const moodleIds = categories.map((category) => {
      return category.categoryMoodleId;
    });

    const savedCategories = await this.categoryRepository
      .createQueryBuilder('category')
      .where(
        'category.categoryMoodleId IN (:...moodleIds) and category.deletedAt is null',
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

    const insertCategories = [];
    const updatedCategoryIds = [];

    for (let j = 0; j < categories.length; j++) {
      let isExist = false;
      for (let i = 0; i < savedCategories.length; i++) {
        if (
          categories[j].categoryMoodleId == savedCategories[i].categoryMoodleId
        ) {
          await this.categoryRepository
            .update(savedCategories[i].id, categories[j])
            .catch((e) => {
              return OperationResult.error(
                new Error(`Can not import categories: ${e.message}`),
              );
            });
          isExist = true;
          updatedCategoryIds.push(savedCategories[i].id);
          break;
        }
      }
      if (!isExist) {
        insertCategories.push(categories[j]);
      }
    }

    const insertResult = await this.createMany(
      CategoryReqDto,
      insertCategories,
    );

    if (insertResult.isOk()) {
      if (updatedCategoryIds.length > 0) {
        return this.categoryRepository
          .createQueryBuilder('category')
          .where('category.id IN (:...ids) and category.deletedAt is null', {
            ids: updatedCategoryIds,
          })
          .getMany()
          .then((upsertedCategories) => {
            insertResult.data.forEach((category) => {
              upsertedCategories.push(category);
            });
            return OperationResult.ok(
              plainToInstance(CategoryResDto, upsertedCategories, {
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
        new Error(`Can not import categories: ${insertResult.message}`),
      );
    }
  }
}
