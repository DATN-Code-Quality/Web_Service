import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';
import { BaseEntity } from "src/common/base.entity";
import { BaseDto } from "src/common/base.dto";
import { Expose } from "class-transformer";

export class ResultResDto extends BaseDto{
  @ApiProperty()
  @IsString()
  @Expose()
  projectId: string;

  @ApiProperty()
  @IsNumberString()
  @Expose()
  bugs: number;

  @ApiProperty()
  @IsNumberString()
  @Expose()
  vulnerabilities: number;

  @ApiProperty()
  @IsNumberString()
  @Expose()
  smells: number;
}
