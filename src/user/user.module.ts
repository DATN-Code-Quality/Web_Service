import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReqDto } from './req/user-req.dto';

@Module({
  imports: [TypeOrmModule.forFeature([UserReqDto]),],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
