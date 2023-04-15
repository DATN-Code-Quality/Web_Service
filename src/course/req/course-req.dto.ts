import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('course', { schema: 'sonarqube' })
export class CourseReqDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'moodleId', length: 255 })
  moodleId: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'courseMoodleId', length: 255 })
  courseMoodleId: string;

  @ApiProperty()
  @IsString()
  @Column('date', { name: 'startAt' })
  startAt: string;

  @ApiProperty()
  @IsString()
  @Column('date', { name: 'endAt' })
  endAt: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'detail', nullable: true, length: 255 })
  detail: string | null;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'summary', nullable: true, length: 255 })
  summary: string | null;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'categoryId', length: 255 })
  categoryId: string;
}
