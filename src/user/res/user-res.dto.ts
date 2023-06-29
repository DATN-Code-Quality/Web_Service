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
import { UserCourseReqDto } from 'src/user-course/req/user-course-req.dto';
import { USER_STATUS } from '../req/user-req.dto';

export const PasswordKey = '227Hcmus#';

export const DEFAULSTR = [
  '0123456789',
  'abcdefghijklmnopqrstuvwxyz',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '#?!@$%^&*-',
];

export class UserResDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  role: string;

  @ApiProperty()
  @IsString()
  @Expose()
  email: string;

  @ApiProperty()
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  moodleId: string;

  // @ApiProperty()
  // @IsString()
  // @Expose()
  // password: string;

  @ApiProperty()
  @IsString()
  @Expose()
  status: USER_STATUS;

  @Expose()
  @OneToMany(() => UserCourseReqDto, (userCourse) => userCourse.user)
  userCourses: UserCourseReqDto[];
}
