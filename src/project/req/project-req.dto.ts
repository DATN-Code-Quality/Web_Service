import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

export enum PROJECT_TYPE {
  JAVA_MAVEN = 0,
  JAVA_GRADLE = 1,
  C_SHARP = 2,
  C_CPP = 3,
  OTHERS = 4,
}

@Entity('project', { schema: 'sonarqube' })
export class ProjectReqDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'key', unique: true, length: 255 })
  key: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'submissionId', nullable: true, length: 255 })
  submissionId: string | null;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'userId', length: 255 })
  userId: string;

  @Column('tinyint', { name: 'type', width: 1 })
  type: PROJECT_TYPE;
}
