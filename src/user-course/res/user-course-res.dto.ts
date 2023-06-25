import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';
import { UserReqDto } from 'src/user/req/user-req.dto';
import { UserResDto } from 'src/user/res/user-res.dto';
import { CourseResDto } from 'src/course/res/course-res.dto';

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

  @Expose()
  user: UserResDto;

  @Expose()
  course: CourseResDto;
}
