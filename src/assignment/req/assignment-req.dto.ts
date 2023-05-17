import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('assignment', { schema: 'sonarqube' })
export class AssignmentReqDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @ApiProperty()
  // @IsString()
  @Column('varchar', {
    name: 'assignmentMoodleId',
    length: 10,
    nullable: true,
    unique: true,
  })
  assignmentMoodleId: string;

  @ApiProperty()
  @IsDateString()
  @Column('datetime', { name: 'dueDate' })
  dueDate: Date;

  @ApiProperty()
  // @IsNumber()
  @Column('tinyint', { name: 'status', width: 1, nullable: true })
  status: boolean;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'courseId', length: 255 })
  courseId: string;

  @ApiProperty()
  // @IsString()
  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @ApiProperty()
  // @IsString()
  @Column('varchar', {
    name: 'attachmentFileLink',
    nullable: true,
    length: 255,
  })
  attachmentFileLink: string | null;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'config', length: 255 })
  config: string;
}
