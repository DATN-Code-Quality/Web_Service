import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseEntity } from "src/common/base.entity";
import { BaseDto } from "src/common/base.dto";
import { Expose } from "class-transformer";

export class CategoryResDto extends BaseDto{
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;
}
