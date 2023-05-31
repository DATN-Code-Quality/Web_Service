import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';
import { UserCourseModule } from './user-course/user-course.module';
import { AssignmentModule } from './assignment/assignment.module';
import { SubmissionModule } from './submission/submission.module';
import { ProjectModule } from './project/project.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CourseMoodleModule } from './courseMoodle/courseMoodle.module';
import { SubmissionMoodleModule } from './submissionMoodle/submissionMoodle.module';
import { AssignmentMoodleModule } from './assignmentMoodle/assignmentMoodle.module';
import { AuthModule } from './auth/auth.module';
import { AssignmentMiddleware } from './middleware/assignment.middleware';
import { SubmissionMiddleware } from './middleware/submission.middleware';
import { SonarqubeModule } from './sonarqube/sonarqube.module';
import { RoleMiddleware } from './middleware/rule.middleware';
import { LoggerModule } from './logger/logger.module';
import { MoodleMiddleware } from './middleware/moodle.middleware';
import { MoodleModule } from './moodle/moodle.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '04042001',
      database: 'sonarqube',
      entities: [
        UserReqDto,
        CategoryReqDto,
        CourseReqDto,
        UserCourseReqDto,
        AssignmentReqDto,
        SubmissionReqDto,
        ProjectReqDto,
      ],

      // logging: 'all',
      synchronize: true,
    }),
    UserModule,
    CategoryModule,
    CourseModule,
    UserCourseModule,
    AssignmentModule,
    SubmissionModule,
    ProjectModule,
    // ResultModule,
    UserMoodleModule,
    CourseMoodleModule,
    SubmissionMoodleModule,
    AssignmentMoodleModule,
    MoodleModule,
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
    // IssueModule,
    // SourceModule,
    // RuleModule,
    SonarqubeModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AssignmentMiddleware).forRoutes(
      {
        path: '/api/assignment/:courseId/:assignmentId',
        method: RequestMethod.GET,
      },
      {
        path: '/api/assignment/:courseId/:assignmentId/report',
        method: RequestMethod.GET,
      },
      {
        path: '/api/assignment/:courseId/:assignmentId/config',
        method: RequestMethod.PUT,
      },
      {
        path: '/api/submission/:courseId/:assignmentId',
        method: RequestMethod.POST,
      },
      {
        path: '/api/submission/:courseId/:assignmentId',
        method: RequestMethod.GET,
      },
    );

    consumer.apply(AssignmentMiddleware, SubmissionMiddleware).forRoutes({
      path: '/api/submission/:courseId/:assignmentId/:submissionId',
      method: RequestMethod.DELETE,
    });

    consumer
      .apply(RoleMiddleware, AssignmentMiddleware, SubmissionMiddleware)
      .forRoutes(
        {
          path: '/api/submission/:courseId/:assignmentId/:submissionId',
          method: RequestMethod.GET,
        },
        {
          path: '/api/sonarqube/issue/:courseId/:assignmentId/:submissionId',
          method: RequestMethod.GET,
        },
        {
          path: '/api/sonarqube/result/:courseId/:assignmentId/:submissionId',
          method: RequestMethod.GET,
        },
      );
    consumer.apply(MoodleMiddleware).forRoutes(
      {
        path: '/api/course/sync-courses',
        method: RequestMethod.GET,
      },
      {
        path: '/api/course/sync-categories',
        method: RequestMethod.GET,
      },
      {
        path: '/api/course/sync-courses-by-category',
        method: RequestMethod.GET,
      },
      {
        path: '/api/course/sync-courses-detail-by-course-moodle-id',
        method: RequestMethod.GET,
      },
      {
        path: '/api/user/sync-users-by-email',
        method: RequestMethod.GET,
      },
      {
        path: '/api/user/sync-users',
        method: RequestMethod.GET,
      },
      {
        path: '/api/user-course/sync-users',
        method: RequestMethod.GET,
      },
    );
  }
}
