import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';

export class UserCourseResDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  courseId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  role: string;

  @ApiProperty()
  @IsBooleanString()
  @Expose()
  status: boolean;
}
