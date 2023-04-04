import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseEntity } from "src/common/base.entity";
import { BaseDto } from "src/common/base.dto";
import { Expose } from "class-transformer";

export class SubmissionResDto extends BaseDto{
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

}
