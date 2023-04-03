import { Module } from '@nestjs/common';
import { UserMoodleController } from './userMoodle.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
  controllers: [UserMoodleController],
  providers: [],
  exports: [],
})
export class UserMoodleModule {}
