import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentReqDto])],
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
