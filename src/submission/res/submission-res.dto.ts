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
  submitType: string;

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
  origin: string;

  @ApiProperty()
  @IsString()
  @Expose()
  status: string;

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
