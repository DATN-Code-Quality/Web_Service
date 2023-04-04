import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultReqDto } from './req/result-req.dto';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResultReqDto]),],
  controllers: [ResultController],
  providers: [ResultService],
  exports: [ResultService],
})
export class ResultModule {}
