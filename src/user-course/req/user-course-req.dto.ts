import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role, SubRole } from 'src/auth/auth.const';
import { BaseEntity } from 'src/common/base.entity';
import { CourseReqDto } from 'src/course/req/course-req.dto';
import { CourseResDto } from 'src/course/res/course-res.dto';
import { UserReqDto } from 'src/user/req/user-req.dto';
import { UserResDto } from 'src/user/res/user-res.dto';
import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from 'typeorm';

@Entity('user_course', { schema: 'sonarqube' })
export class UserCourseReqDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'courseId', length: 255 })
  courseId: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'userId', length: 255 })
  userId: string;

  @ApiProperty()
  @IsString()
  @Column('varchar', { name: 'role', length: 255 })
  role: string;

  @ApiProperty()
  // @IsBooleanString()
  @Column('tinyint', { name: 'status', width: 1, nullable: true })
  status: boolean;

  @ManyToOne(() => UserReqDto, (user) => user.userCourses, {
    // eager: true,
  })
  user: UserResDto;

  @ManyToOne(() => CourseReqDto, (course) => course.userCourses, {
    // eager: true,
  })
  course: CourseResDto;

  static Student(courseId: string, userId: string) {
    const student = new UserCourseReqDto();
    student.courseId = courseId;
    student.userId = userId;
    student.status = true;
    student.role = SubRole.STUDENT;

    return student;
  }

  static Teacher(courseId: string, userId: string) {
    const teacher = new UserCourseReqDto();
    teacher.courseId = courseId;
    teacher.userId = userId;
    teacher.status = true;
    teacher.role = SubRole.TEACHER;
    return teacher;
  }
}
