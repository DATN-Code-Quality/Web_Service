import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { SubRole } from 'src/auth/auth.const';
import { SubRoles } from 'src/auth/auth.decorator';
import { ServiceResponse } from 'src/common/service-response';
import { GAssignmentService } from 'src/gRPc/services/assignment';

@ApiTags('Assignment Moodle')
@Controller('/api/assignment-moodle')
export class AssignmentMoodleController implements OnModuleInit {
  private assignmentService: GAssignmentService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.assignmentService =
      this.client.getService<GAssignmentService>('GAssignmentService');
  }

  @SubRoles(SubRole.TEACHER)
  @Get('/get-assignments-by-course-id')
  async getUserByEmail(@Query() query: string) {
    const response$ = this.assignmentService
      .getAllAssignmentsByCourseId({
        courseMoodleId: query['courseMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const assignments = resultDTO.data.map((assignment) => ({
      ...assignment,
      dueDate: new Date(parseInt(assignment.dueDate, 10) * 1000),
    }));
    const newResultDTO = {
      ...resultDTO,
      assignments,
    };
    const result = ServiceResponse.resultFromServiceResponse(
      newResultDTO,
      'assignments',
    );
    return result;
  }
}
