import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserMoodleModule } from './userMoodle/userMoodle.module';

@Module({
  imports: [UserModule, UserMoodleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
