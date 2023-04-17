import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SourceController } from './source.controller';

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
          keepalive: {
            keepaliveTimeoutMs: 60000,
          },
        },
      },
    ]),
  ],
  controllers: [SourceController],
  providers: [],
  exports: [],
})
export class SourceModule {}
