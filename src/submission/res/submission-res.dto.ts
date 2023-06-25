import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';
import { UserResDto } from 'src/user/res/user-res.dto';
import {
  SUBMISSION_ORIGIN,
  SUBMISSION_STATUS,
  SUBMISSION_TYPE,
} from '../req/submission-req.dto';

export class SubmissionResDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  assignmentId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  link: string;

  @ApiProperty()
  @IsString()
  @Expose()
  note: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  submitType: SUBMISSION_TYPE;

  @ApiProperty()
  @IsDate()
  @Column('datetime', { name: 'timemodified' })
  timemodified: Date;

  @ApiProperty()
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  origin: SUBMISSION_ORIGIN;

  @ApiProperty()
  @IsString()
  @Expose()
  status: SUBMISSION_STATUS;

  @ApiProperty()
  @IsString()
  @Expose()
  grade: number | null;

  @ApiProperty()
  @IsString()
  @Expose()
  submissionMoodleId: string;

  @Expose()
  user: UserResDto;
}
