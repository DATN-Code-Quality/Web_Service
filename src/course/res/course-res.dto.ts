import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';

export class CourseResDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  moodleId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  courseMoodleId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  startAt: string;

  @ApiProperty()
  @IsString()
  @Expose()
  endAt: string;

  @ApiProperty()
  @IsString()
  @Expose()
  detail: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  summary: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  categoryId: string;
}
