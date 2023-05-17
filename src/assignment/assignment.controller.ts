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
  Request,
  Put,
  Response,
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
import { Public, Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';
import { OperationResult } from 'src/common/operation-result';
import { GSonarqubeService } from 'src/gRPc/services/sonarqube';
import { defaultConfig } from 'src/gRPc/interfaces/sonarqube/QulaityGate';
import { UserReqDto } from 'src/user/req/user-req.dto';

@ApiTags('Assignment')
@Controller('/api/assignment')
export class AssignmentController implements OnModuleInit {
  private gAssignmentService: GAssignmentService;
  private gSonarqubeService: GSonarqubeService;

  constructor(
    private readonly assignmentService: AssignmentService,
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.gAssignmentService =
      this.client.getService<GAssignmentService>('GAssignmentService');
    this.gSonarqubeService =
      this.client.getService<GSonarqubeService>('GSonarqubeService');
  }

  // @Get('/assignments')
  // async getAllAssignments() {
  //   const result = await this.assignmentService.findAll(AssignmentResDto);
  //   return result;
  // }

  @SubRoles(SubRole.TEACHER)
  @Post(':courseId/assignments')
  async addAssignments(
    @Body(new ParseArrayPipe({ items: AssignmentReqDto }))
    assignments: AssignmentReqDto[],
    @Param('courseId') courseId: string,
    @Request() req,
  ) {
    assignments.forEach((assignment) => {
      assignment.courseId = courseId;
    });
    const result = await this.assignmentService.createMany(
      AssignmentResDto,
      assignments,
    );

    if (result.isOk()) {
      for (let i = 0; i < result.data.length; i++) {
        const response = await firstValueFrom(
          this.gSonarqubeService.createQualityGate(
            defaultConfig(result.data[i].id),
          ),
        );

        if (response.error === 0) {
          await this.assignmentService.update(result.data[i].id, {
            config: response.data,
          } as AssignmentResDto);

          result.data[i].config = response.data;
        }
      }

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

      return OperationResult.ok({
        assignments: result.data,
        role: req.headers['role'],
      });
    }

    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Post(':courseId')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async addAssignment(
    @Body() assignment: AssignmentReqDto,
    @Param('courseId') courseId: string,
    @Request() req,
  ) {
    assignment.courseId = courseId;

    const result = await this.assignmentService.create(
      AssignmentReqDto,
      assignment,
    );

    if (result.isOk()) {
      const response = await firstValueFrom(
        this.gSonarqubeService.createQualityGate(defaultConfig(result.data.id)),
      );

      if (response.error === 0) {
        await this.assignmentService.update(result.data.id, {
          config: response.data,
        } as AssignmentResDto);

        result.data.config = response.data;
      }

      return OperationResult.ok({
        assignment: result.data,
        role: req.headers['role'],
      });
    }

    // const result = await firstValueFrom(
    //   this.gSonarqubeService.createQualityGate(
    //     defaultConfig(`${Date.now().toString()}`),
    //   ),
    // );

    return result;
  }

  //Moodle:
  @SubRoles(SubRole.TEACHER)
  @Get(':courseId/sync-assignments-by-course-id')
  async getMoodleAssignmentsByCourseId(@Query() query: string, @Request() req) {
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

    if (result.isOk()) {
      return OperationResult.ok({
        assignments: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER, SubRole.STUDENT)
  @Get(':courseId/:assignmentId')
  async getAssignmentById(
    @Param('assignmentId') assignmentId: string,
    @Request() req,
  ) {
    const result = await this.assignmentService.findOne(
      AssignmentResDto,
      assignmentId,
    );

    if (result.isOk()) {
      return OperationResult.ok({
        assignment: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER, SubRole.STUDENT)
  @Get(':courseId')
  async getAssignmentsByCourseId(
    @Param('courseId') courseId: string,
    @Request() req,
  ) {
    const result = await this.assignmentService.findAssignmentsByCourseId(
      // query['courseId'],
      courseId,
    );

    if (result.isOk()) {
      return OperationResult.ok({
        assignments: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Get(':courseId/:assignmentId/report')
  async getReport(
    @Param('courseId') courseId: string,
    @Param('assignmentId') assignmentId: string,
    @Request() req,
  ) {
    const result = await this.assignmentService.getReport(
      courseId,
      assignmentId,
    );
    if (result.isOk()) {
      return OperationResult.ok({
        report: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER)
  @Put(':courseId/:assignmentId/config')
  async updateCongig(
    @Param('assignmentId') assignmentId: string,
    @Body() data,
    @Request() req,
  ) {
    //parse config thành 1 list các điều kiện
    const conditions = defaultConfig(`${Date.now.toString()}`);

    const result = await firstValueFrom(
      this.gSonarqubeService.updateConditions({
        assignmentId: assignmentId,
        conditions: conditions.conditions,
      }),
    );
    if (result.error === 0) {
      //Lưu config vào db
      const assignment = await this.assignmentService.update(assignmentId, {
        config: data['config'],
      } as any);
      if (assignment.isOk()) {
        return OperationResult.ok({
          assignment: result.data,
          role: req.headers['role'],
        });
      }
      return assignment;
    } else {
      return OperationResult.error(new Error(result.message));
    }
  }

  // @SubRoles(SubRole.TEACHER)
  // @Post('/:courseId/import')
  // async importuser(@Body() assignments: AssignmentReqDto[]) {
  //   return this.assignmentService.upsertAssignments(assignments);
  // }
}
