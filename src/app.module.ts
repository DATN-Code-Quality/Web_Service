import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './temporal/client.module';
import { UserModule } from './user/user.module';
import { UserMoodleModule } from './userMoodle/userMoodle.module';

@Module({
  imports: [ClientModule, UserModule, UserMoodleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
