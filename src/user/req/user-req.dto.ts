import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { SubmissionReqDto } from 'src/submission/req/submission-req.dto';
import { SubmissionResDto } from 'src/submission/res/submission-res.dto';
import { UserCourseReqDto } from 'src/user-course/req/user-course-req.dto';
import { Column, Entity, OneToMany } from 'typeorm';

export enum USER_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  BLOCK = 2,
}

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
  // @IsString()
  @Column('varchar', {
    name: 'moodleId',
    length: 255,
    nullable: true,
    unique: true,
  })
  moodleId: string;

  @ApiProperty()
  // @IsString()
  @IsOptional()
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @ApiProperty()
  // @IsBoolean()
  @Column('tinyint', { name: 'status', width: 1 })
  status: USER_STATUS;

  // @OneToMany(() => Project, (project) => project.user)
  // projects: Project[];

  @OneToMany(() => SubmissionReqDto, (submission) => submission.user)
  submissions: SubmissionReqDto[];

  @OneToMany(() => UserCourseReqDto, (userCourse) => userCourse.user)
  userCourses: UserCourseReqDto[];
}
