import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity("result", { schema: "sonarqube" })
export class ResultReqDto extends BaseEntity{
  @ApiProperty()
  @IsString()
  @Column("varchar", { name: "projectId", length: 255 })
  projectId: string;

  @ApiProperty()
  @IsNumberString()
  @Column("int", { name: "bugs" })
  bugs: number;

  @ApiProperty()
  @IsNumberString()
  @Column("int", { name: "vulnerabilities" })
  vulnerabilities: number;

  @ApiProperty()
  @IsNumberString()
  @Column("int", { name: "smells" })
  smells: number;
}
