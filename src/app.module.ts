import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserMoodleModule } from './userMoodle/userMoodle.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReqDto } from './user/req/user-req.dto';
import { CategoryReqDto } from './category/req/category-req.dto';
import { CourseReqDto } from './course/req/course-req.dto';
import { UserCourseReqDto } from './user-course/req/user-course-req.dto';
import { AssignmentReqDto } from './assignment/req/assignment-req.dto';
import { SubmissionReqDto } from './submission/req/submission-req.dto';
import { ProjectReqDto } from './project/req/project-req.dto';
import { ResultReqDto } from './result/req/result-req.dto';
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';
import { UserCourseModule } from './user-course/user-course.module';
import { AssignmentModule } from './assignment/assignment.module';
import { SubmissionModule } from './submission/submission.module';
import { ProjectModule } from './project/project.module';
import { ResultModule } from './result/result.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CourseMoodleModule } from './courseMoodle/courseMoodle.module';
import { SubmissionMoodleModule } from './submissionMoodle/submissionMoodle.module';
import { AssignmentMoodleModule } from './assignmentMoodle/assignmentMoodle.module';
import { IssueModule } from './issue/issue.module';
import { SourceModule } from './source/source.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'sonarqube',
      entities: [
        UserReqDto,
        CategoryReqDto,
        CourseReqDto,
        UserCourseReqDto,
        AssignmentReqDto,
        SubmissionReqDto,
        ProjectReqDto,
        ResultReqDto,
      ],

      logging: 'all',
      synchronize: true,
    }),
    UserModule,
    CategoryModule,
    CourseModule,
    UserCourseModule,
    AssignmentModule,
    SubmissionModule,
    ProjectModule,
    ResultModule,
    UserMoodleModule,
    CourseMoodleModule,
    SubmissionMoodleModule,
    AssignmentMoodleModule,
    {
      ...ClientsModule.register([
        {
          name: 'THIRD_PARTY_SERVICE',
          transport: Transport.GRPC,
          options: {
            url: 'localhost:5001',
            package: 'third_party_service',
            protoPath: join(__dirname, './third-party-service.proto'),
            loader: { keepCase: true },
          },
        },
      ]),
      global: true,
    },
    IssueModule,
    SourceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
