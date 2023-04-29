import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user', { schema: 'sonarqube' })
export class UserReqDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'role', length: 20 })
  role: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'email', length: 50, unique: true })
  email: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'userId', length: 20, unique: true })
  userId: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'moodleId', length: 255 })
  moodleId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @ApiProperty()
  @IsBoolean()
  @Column('tinyint', { name: 'status', width: 1 })
  status: boolean;
}
