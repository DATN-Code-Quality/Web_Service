import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsBooleanString, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity("user_course", { schema: "sonarqube" })
export class UserCourseReqDto extends BaseEntity{
  @ApiProperty()
  @IsString()
  @Column("varchar", { name: "courseId", length: 255 })
  courseId: string;

  @ApiProperty()
  @IsString()
  @Column("varchar", { name: "userId", length: 255 })
  userId: string;

  @ApiProperty()
  @IsString()
  @Column("varchar", { name: "role", length: 255 })
  role: string;

  @ApiProperty()
  @IsBooleanString()
  @Column("tinyint", { name: "status", width: 1 })
  status: boolean;
}
