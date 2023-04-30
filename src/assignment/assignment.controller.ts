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
  UsePipes,
  UseFilters,
  ParseArrayPipe,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { AssignmentCronjobRequest } from 'src/gRPc/interfaces/Assignment';
import { GAssignmentService } from 'src/gRPc/services/assignment';
import { AssignmentService } from './assignment.service';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentResDto } from './res/assignment-res.dto';
import { ServiceResponse } from 'src/common/service-response';
import { ValidationPipe } from 'src/common/validation.pipe';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';
import { Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';

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
      this.client.getService<GAssignmentService>('GAssignmentService');
  }

  @Get('/assignments')
  async getAllAssignments() {
    const result = await this.assignmentService.findAll(AssignmentResDto);
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Post('/assignments')
  async addAssignments(
    @Body(new ParseArrayPipe({ items: AssignmentReqDto }))
    assignments: AssignmentReqDto[],
  ) {
    const result = await this.assignmentService.createMany(
      AssignmentReqDto,
      assignments,
    );

    Logger.debug('Result: ' + JSON.stringify(result));

    const savedAssignments: AssignmentCronjobRequest[] = result.data.map(
      (assignment) => ({
        id: assignment.id,
        assignmentMoodleId: assignment.assignmentMoodleId,
        dueDate: new Date(assignment.dueDate).getTime(),
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

  @SubRoles(SubRole.TEACHER)
  @Post('')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async addAssignment(@Body() assignment: AssignmentReqDto) {
    const result = await this.assignmentService.create(
      AssignmentReqDto,
      assignment,
    );
    return result;
  }

  @SubRoles(SubRole.TEACHER, SubRole.STUDENT)
  @Get('/:assignmentId')
  async getAssignmentById(@Param('assignmentId') assignmentId: string) {
    const result = await this.assignmentService.findOne(
      AssignmentResDto,
      assignmentId,
    );
    return result;
  }

  @SubRoles(SubRole.TEACHER, SubRole.STUDENT)
  @Get('')
  async getAssignmentsByCourseId(@Query() query: string) {
    const result = await this.assignmentService.findAssignmentsByCourseId(
      query['courseId'],
    );
    return result;
  }

  //Moodle:
  @SubRoles(SubRole.TEACHER)
  @Get('/sync-assignments-by-course-id')
  async getMoodleAssignmentsByCourseId(@Query() query: string) {
    const response$ = this.gAssignmentService
      .getAllAssignmentsByCourseId({
        courseMoodleId: query['courseMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const data = resultDTO.data.map((assignment) => ({
      ...assignment,
      dueDate: new Date(parseInt(assignment.dueDate, 10) * 1000),
    }));
    const newResultDTO = {
      ...resultDTO,
      data,
    };
    const result = ServiceResponse.resultFromServiceResponse(
      newResultDTO,
      'data',
    );
    return result;
  }
}
