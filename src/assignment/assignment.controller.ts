import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';
import { AssignmentResDto } from './res/assignment-res.dto';

@ApiTags('Assignment')
@Controller('/api/assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}
  @Get('/get-all-assignment')
  async getAllCategorys() {
    const result = await this.assignmentService.findAll(AssignmentResDto);
    return result;
  }
}
