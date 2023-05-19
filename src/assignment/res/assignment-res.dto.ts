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
import { Expose, Transform } from 'class-transformer';
import { ConfigObject } from '../req/assignment-req.dto';

export class AssignmentResDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  dueDate: Date;

  @ApiProperty()
  @IsString()
  @Expose()
  status: boolean;

  @ApiProperty()
  @IsString()
  @Expose()
  courseId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  assignmentMoodleId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  description: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  attachmentFileLink: string | null;

  @ApiProperty()
  @IsString()
  @Expose()
  config: string;

  @Transform(({ obj }) => JSON.parse(obj.config))
  @Expose()
  configObject: ConfigObject;
}
