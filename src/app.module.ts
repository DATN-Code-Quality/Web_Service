import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserMoodleModule } from './userMoodle/userMoodle.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    UserMoodleModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
