import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';

export class ResultResDto extends BaseDto {
  @ApiProperty()
  @Expose()
  submissionId: string;

  @ApiProperty()
  @Expose()
  violations: number;

  @ApiProperty()
  @Expose()
  code_smells: number;

  @ApiProperty()
  @Expose()
  bugs: number;

  @ApiProperty()
  @Expose()
  vulnerabilities: number;

  @ApiProperty()
  @Expose()
  blocker_violations: number;

  @ApiProperty()
  @Expose()
  critical_violations: number;

  @ApiProperty()
  @Expose()
  major_violations: number;

  @ApiProperty()
  @Expose()
  minor_violations: number;

  @ApiProperty()
  @Expose()
  info_violations: number;

  @ApiProperty()
  @Expose()
  duplicated_lines_density: number;

  @ApiProperty()
  @Expose()
  coverage: number;

  @ApiProperty()
  @Expose()
  reliability_rating: number;

  @ApiProperty()
  @Expose()
  security_rating: number;

  @ApiProperty()
  @Expose()
  sqale_rating: number;

  @ApiProperty()
  @Expose()
  ncloc: number;
}
