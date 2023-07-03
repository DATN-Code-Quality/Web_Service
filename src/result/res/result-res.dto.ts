import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';

export class ResultResDto extends BaseDto {
  @ApiProperty()
  @Expose()
  submissionId: string;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  codeSmell: number;

  @ApiProperty()
  @Expose()
  bug: number;

  @ApiProperty()
  @Expose()
  vulnerabilities: number;

  @ApiProperty()
  @Expose()
  blocker: number;

  @ApiProperty()
  @Expose()
  critical: number;

  @ApiProperty()
  @Expose()
  major: number;

  @ApiProperty()
  @Expose()
  minor: number;

  @ApiProperty()
  @Expose()
  info: number;

  @ApiProperty()
  @Expose()
  duplicatedLinesDensity: number;

  @ApiProperty()
  @Expose()
  coverage: number;

  @ApiProperty()
  @Expose()
  reliabilityRating: number;

  @ApiProperty()
  @Expose()
  securityRating: number;

  @ApiProperty()
  @Expose()
  sqaleRating: number;

  @ApiProperty()
  @Expose()
  ncloc: number;
}
