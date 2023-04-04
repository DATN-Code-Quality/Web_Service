import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity("category", { schema: "sonarqube" })
export class CategoryReqDto extends BaseEntity{
  @ApiProperty()
  @IsString()
  @Column("varchar", { name: "name", length: 255 })
  name: string;
}
