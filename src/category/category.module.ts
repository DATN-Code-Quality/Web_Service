import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryReqDto } from './req/category-req.dto';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryReqDto])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
