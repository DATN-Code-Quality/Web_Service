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
  violations: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'codeSmell', width: 200 })
  code_smells: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'bug' })
  bugs: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'vulnerabilities', width: 200 })
  vulnerabilities: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'blocker', width: 200 })
  blocker_violations: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'critical', width: 200 })
  critical_violations: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'major', width: 200 })
  major_violations: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'minor', width: 200 })
  minor_violations: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'info', width: 200 })
  info_violations: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'duplicatedLinesDensity' })
  duplicated_lines_density: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'coverage' })
  coverage: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'reliabilityRating' })
  reliability_rating: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'securityRating' })
  security_rating: number;

  @ApiProperty()
  @IsNumber()
  @Column('float', { name: 'sqaleRating' })
  sqale_rating: number;

  @ApiProperty()
  @IsNumber()
  @Column('int', { name: 'ncloc' })
  ncloc: number;
}
