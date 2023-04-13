import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';
import { AssignmentResDto } from './res/assignment-res.dto';
import { AssignmentReqDto } from './req/assignment-req.dto';

@ApiTags('Assignment')
@Controller('/api/assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}
  @Get('/get-all-assignment')
  async getAllCategorys() {
    const result = await this.assignmentService.findAll(AssignmentResDto);
    return result;
  }

  @Post('/add-assignments')
  async addSubmissions(@Body() assignments: AssignmentReqDto[]) {
    const result = await this.assignmentService.createMany(
      AssignmentReqDto,
      assignments,
    );
    return result;
  }

  @Get('/get-assignment/:assignmentId')
  async getAssignmentById(@Param('assignmentId') assignmentId: string) {
    const result = await this.assignmentService.findOne(
      AssignmentResDto,
      assignmentId,
    );
    return result;
  }

  @Get('/get-assignments')
  async getAssignmentsByCourseId(@Query() query: string) {
    const result = await this.assignmentService.findAssignmentsByCourseId(
      query['courseId'],
    );
    return result;
  }
}
