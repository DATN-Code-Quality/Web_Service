import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IssueController } from './issue.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'THIRD_PARTY_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:5001',
          package: 'third_party_service',
          protoPath: join(__dirname, '../third-party-service.proto'),
        },
      },
    ]),
  ],
  controllers: [IssueController],
  providers: [],
  exports: [],
})
export class IssueModule {}
