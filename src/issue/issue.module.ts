import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IssueController } from './issue.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserCourseModule } from 'src/user-course/user-course.module';
import { SubRolesGuard } from 'src/auth/guard/sub-roles.guard';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'THIRD_PARTY_SERVICE',
    //     transport: Transport.GRPC,
    //     options: {
    //       url: 'localhost:5001',
    //       package: 'third_party_service',
    //       protoPath: join(__dirname, '../third-party-service.proto'),
    //       keepalive: {
    //         keepaliveTimeoutMs: 60000,
    //       },
    //     },
    //   },
    // ]),
    UserCourseModule,
  ],
  controllers: [IssueController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SubRolesGuard,
    },
  ],
  exports: [],
})
export class IssueModule {}
