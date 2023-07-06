import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  OnModuleInit,
  DefaultValuePipe,
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
import { createCondition } from 'src/gRPc/interfaces/sonarqube/QulaityGate';
import { UserReqDto } from 'src/user/req/user-req.dto';
import { GSubmissionService } from 'src/gRPc/services/submission';
import { SubmissionService } from 'src/submission/submission.service';
import { SUBMISSION_STATUS } from 'src/submission/req/submission-req.dto';
import { ResultService } from 'src/result/result.service';

@ApiTags('Assignment')
@Controller('/api/assignment')
export class AssignmentController implements OnModuleInit {
  private gAssignmentService: GAssignmentService;
  private gSonarqubeService: GSonarqubeService;

  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly submissionService: SubmissionService,
    private readonly resultService: ResultService,

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
      assignment.config = JSON.stringify(assignment.configObject);
    });
    const result = await this.assignmentService.upsertAssignments(assignments);

    if (result.isOk()) {
      for (let i = 0; i < result.data.length; i++) {
        // const response = await firstValueFrom(
        //   this.gSonarqubeService.createQualityGate({
        //     assignmentId: result.data[i].id,
        //     conditions: createCondition(JSON.parse(result.data[i].config)),
        //   }),
        // );
        // if (response.error === 0) {
        //   await this.assignmentService.update(result.data[i].id, {
        //     config: response.data,
        //   } as AssignmentResDto);
        //   result.data[i].config = response.data;
        // }
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
    assignment.config = JSON.stringify(assignment.configObject);

    const result = await this.assignmentService.create(
      AssignmentReqDto,
      assignment,
    );

    const conditions = createCondition(assignment.configObject);
    if (result.isOk()) {
      // const response = await firstValueFrom(
      //   this.gSonarqubeService.createQualityGate({
      //     assignmentId: result.data.id,
      //     conditions: conditions, //createCondition(assignment.configObject),
      //   }),
      // );

      // if (response.error === 0) {
      //   const savedAssignment: AssignmentCronjobRequest = {
      //     id: assignment.id,
      //     assignmentMoodleId: assignment.assignmentMoodleId as any,
      //     dueDate: new Date(assignment.dueDate).getTime() as any,
      //   };

      //   Logger.debug('Data: ' + JSON.stringify(savedAssignment));

      //   firstValueFrom(
      //     this.gAssignmentService
      //       .addAssignmentCronjob({
      //         assignments: [savedAssignment],
      //       })
      //       .pipe(),
      //   );

      //   return OperationResult.ok({
      //     assignment: result.data,
      //     role: req.headers['role'],
      //   });
      // } else {
      //   return OperationResult.error(new Error(response.message));
      // }
      const savedAssignment: AssignmentCronjobRequest = {
        id: assignment.id,
        assignmentMoodleId: assignment.assignmentMoodleId as any,
        dueDate: new Date(assignment.dueDate).getTime() as any,
      };

      Logger.debug('Data: ' + JSON.stringify(savedAssignment));

      firstValueFrom(
        this.gAssignmentService
          .addAssignmentCronjob({
            assignments: [savedAssignment],
          })
          .pipe(),
      );

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
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
    @Request() req,
  ) {
    const result = await this.assignmentService.findAssignmentsByCourseId(
      // query['courseId'],
      courseId,
      search,
      limit,
      offset,
    );

    if (result.isOk()) {
      return OperationResult.ok({
        total: result.data.total,
        assignments: result.data.assignments,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.TEACHER, SubRole.ADMIN)
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
  @Put(':courseId/:assignmentId')
  async updateCongig(
    @Param('assignmentId') assignmentId: string,
    @Body() data,
    @Request() req,
  ) {
    const payload = {
      name: data['name'],
      dueDate: data['dueDate'],
      description: data['description'],
      config: JSON.stringify(data['configObject']),
    };

    //parse config thành 1 list các điều kiện
    const conditions = createCondition(data['configObject']);

    const assignment = await this.assignmentService.update(
      assignmentId,
      payload as any,
    );

    if (assignment.isOk()) {
      const result = this.assignmentService
        .updateStatusOfSubmissions(data['configObject'], assignmentId)
        .then();

      return OperationResult.ok({
        assignment: 'Update successfully',
        role: req.headers['role'],
      });
    }
    return assignment;

    // const result = await firstValueFrom(
    //   this.gSonarqubeService.updateConditions({
    //     assignmentId: assignmentId,
    //     conditions: conditions,
    //   }),
    // );

    // if (result.i === 0) {
    //   //Lưu payload vào db

    // } else {
    //   return OperationResult.error(new Error(result.message));
    // }
  }

  // @SubRoles(SubRole.TEACHER)
  // @Post('/:courseId/import')
  // async importuser(@Body() assignments: AssignmentReqDto[]) {
  //   return this.assignmentService.upsertAssignments(assignments);
  // }

  @SubRoles(SubRole.TEACHER, SubRole.ADMIN)
  @Get(':courseId/:assignmentId/export')
  async exportResult(
    @Param('courseId') courseId: string,
    @Param('assignmentId') assignmentId: string,
    @Request() req,
  ) {
    const submissions =
      await this.submissionService.findSubmissionsByAssigmentId(
        assignmentId,
        null,
        null,
      );

    const data = [];

    if (submissions.isOk()) {
      for (let i = 0; i < submissions.data.submissions.length; i++) {
        const resultItem = {};
        resultItem['submission'] = {
          submissionId: submissions.data.submissions[i].id,
          userId: submissions.data.submissions[i].user.id,
          userName: submissions.data.submissions[i].user.name,
          userMoodleId: submissions.data.submissions[i].user.userId,
          status: submissions.data.submissions[i].status,
        };

        if (
          submissions.data.submissions[i].status == SUBMISSION_STATUS.PASS ||
          submissions.data.submissions[i].status == SUBMISSION_STATUS.FAIL
        ) {
          // const results = await firstValueFrom(
          //   await this.gSonarqubeService.getResultsBySubmissionId({
          //     submissionId: submissions.data.submissions[i].id,
          //     page: null,
          //     pageSize: null,
          //   }),
          // );

          // if (results.error == 0) {
          //   const metricItem = {};
          //   results.data.measures.forEach((measure) => {
          //     metricItem[`${measure.metric}`] =
          //       measure['history'][measure['history'].length - 1]['value'];
          //   });
          //   resultItem['result'] = metricItem;
          // }

          const result = await this.resultService.getResultBySubmissionId(
            submissions.data.submissions[i].id,
          );
          if (result.isOk()) {
            resultItem['result'] = result.data;
          }
        }
        data.push(resultItem);
      }
    }

    return OperationResult.ok({
      results: data,
      role: SubRole.TEACHER,
    });
  }

  @SubRoles(SubRole.STUDENT, SubRole.TEACHER, SubRole.ADMIN)
  @Get(':courseId/:assignmentId/top-issue')
  async getTopIssue(
    @Param('courseId') courseId: string,
    @Param('assignmentId') assignmentId: string,
    @Query('language', new DefaultValuePipe(true)) language: string,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    return await this.assignmentService.getTopIssue(
      assignmentId,
      language,
      limit,
    );
  }
}
