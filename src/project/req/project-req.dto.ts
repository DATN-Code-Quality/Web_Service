import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

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
}
