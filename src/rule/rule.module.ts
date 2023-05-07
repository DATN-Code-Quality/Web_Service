import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { RuleController } from './rule.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

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
  ],
  controllers: [RuleController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class RuleModule {}
