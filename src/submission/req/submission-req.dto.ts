import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  isDate,
} from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('submission', { schema: 'sonarqube' })
export class SubmissionReqDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'assignmentId', length: 255 })
  assignmentId: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'link', length: 255 })
  link: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'note', nullable: true, length: 255 })
  note: string | null;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'submitType', length: 255 })
  submitType: string;

  @ApiProperty()
  @IsDate()
  @Column('datetime', { name: 'timemodified' })
  timemodified: Date;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'userId', length: 255 })
  userId: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'origin', length: 255 })
  origin: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'status', length: 255 })
  status: string;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'grade', nullable: true, precision: 12 })
  grade: number | null;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'userId', length: 10 })
  submissionMoodleId: string;
}
