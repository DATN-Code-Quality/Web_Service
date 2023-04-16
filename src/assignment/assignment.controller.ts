import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  OnModuleInit,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { AssignmentCronjobRequest } from 'src/gRPc/interfaces/Assignment';
import { GAssignmentService } from 'src/gRPc/services/assignment';
import { AssignmentService } from './assignment.service';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentResDto } from './res/assignment-res.dto';

@ApiTags('Assignment')
@Controller('/api/assignment')
export class AssignmentController implements OnModuleInit {
  private gAssignmentService: GAssignmentService;

  constructor(
    private readonly assignmentService: AssignmentService,
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.gAssignmentService =
      this.client.getService<GAssignmentService>('AssignmentService');
  }

  @Get('/get-all-assignment')
  async getAllCategorys() {
    const result = await this.assignmentService.findAll(AssignmentResDto);
    return result;
  }

  @Post('/add-assignments')
  async addAssignments(@Body() assignments: AssignmentReqDto[]) {
    const result = await this.assignmentService.createMany(
      AssignmentReqDto,
      assignments,
    );

    Logger.debug('Result: ' + JSON.stringify(result));

    const savedAssignments: AssignmentCronjobRequest[] = result.data.map(
      (assignment) => ({
        id: assignment.id,
        assignmentMoodleId: assignment.assignmentMoodleId,

        //chỗ này update sang milliseconds giúp em với
        dueDate: assignment.dueDate,
      }),
    );

    Logger.debug('Data: ' + JSON.stringify(savedAssignments));

    firstValueFrom(
      this.gAssignmentService
        .addAssignmentCronjob({
          assignments: savedAssignments,
        })
        .pipe(),
    );

    return result;
  }

  @Post('/create-submission')
  async addAssignment(@Body() assignment: AssignmentReqDto) {
    const result = await this.assignmentService.create(
      AssignmentReqDto,
      assignment,
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
