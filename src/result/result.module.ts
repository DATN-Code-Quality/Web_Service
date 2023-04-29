import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultReqDto } from './req/result-req.dto';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ResultReqDto])],
  controllers: [ResultController],
  providers: [
    ResultService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [ResultService],
})
export class ResultModule {}
