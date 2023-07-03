import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('result', { schema: 'sonarqube' })
export class ResultReqDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'submissionId', unique: true, length: 255 })
  submissionId: string;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'total', width: 200 })
  total: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'codeSmell', width: 200 })
  codeSmell: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'bug' })
  bug: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'vulnerabilities', width: 200 })
  vulnerabilities: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'blocker', width: 200 })
  blocker: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'critical', width: 200 })
  critical: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'major', width: 200 })
  major: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'minor', width: 200 })
  minor: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'info', width: 200 })
  info: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'duplicatedLinesDensity' })
  duplicatedLinesDensity: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'coverage' })
  coverage: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'reliabilityRating' })
  reliabilityRating: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'securityRating' })
  securityRating: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'sqaleRating' })
  sqaleRating: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'ncloc' })
  ncloc: number;
}
