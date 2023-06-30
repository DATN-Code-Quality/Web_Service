import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseArrayPipe,
  DefaultValuePipe,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionResDto } from './res/submission-res.dto';
import { SubmissionService } from './submission.service';
import {
  SUBMISSION_STATUS,
  SUBMISSION_TYPE,
  SubmissionReqDto,
} from './req/submission-req.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { GSubmissionService } from 'src/gRPc/services/submission';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/common/service-response';
import { Roles, SubRoles } from 'src/auth/auth.decorator';
import { Role, SubRole } from 'src/auth/auth.const';
import { OperationResult } from 'src/common/operation-result';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ScanSubmissionRequest } from 'src/gRPc/interfaces/Submission';
@ApiTags('Submission')
@Controller('/api/submission')
export class SubmissionController implements OnModuleInit {
  private gSubmissionService: GSubmissionService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
    private readonly submissionService: SubmissionService,
  ) {}
  onModuleInit() {
    this.gSubmissionService =
      this.client.getService<GSubmissionService>('GSubmissionService');
  }

  @SubRoles(SubRole.STUDENT)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          const courseId = req.params['courseId'];
          const assignmentId = req.params['assignmentId'];
          const userId = req.headers['userId'];
          const path = `${process.env.DESTINATION_PATH}/${courseId}/${assignmentId}/${userId}`;
          req.body[
            'link'
          ] = `/${courseId}/${assignmentId}/${userId}/${file.originalname}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }
          cb(null, path);
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error, acceptFile: boolean) => void,
      ) => {
        if (Boolean(file.mimetype.match(/(zip)/))) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }),
  )
  @Post('/:courseId/:assignmentId')
  async addSubmission(
    @UploadedFile()
    file: Express.Multer.File,
    @Param('assignmentId') assignmentId: string,
    @Body() submission: SubmissionReqDto,
    @Request() req,
  ) {
    if (submission.submitType === SUBMISSION_TYPE.FILE) {
      if (!file) {
        return OperationResult.error(new Error('Invalid file extension'));
      }
      if (file.size > 100 * 1024 * 1024) {
        return OperationResult.error(new Error('File too large'));
      }
    }
    submission.assignmentId = assignmentId;
    submission.userId = req.headers['userId'];
    submission.status = SUBMISSION_STATUS.SUBMITTED;
    Logger.debug('Submission: ' + JSON.stringify(submission));

    const result = await this.submissionService.upsertSubmission(submission);

    if (result.isOk()) {
      firstValueFrom(
        this.gSubmissionService.scanSubmission(result.data).pipe(),
      );
      return OperationResult.ok({
        submission: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }
  @SubRoles(SubRole.TEACHER)
  @Put(':courseId/:assignmentId/:submissionId')
  async updateCongig(
    @Param('assignmentId') assignmentId: string,
    @Param('submissionId') submissionId: string,
    @Body() data,
    @Request() req,
  ) {
    const payload = {
      link: data['link'],
      note: data['note'],
      submitType: data['submitType'],
      timemodified: data['timemodified'],
      origin: data['origin'],
      grade: data['grade'],
    };
    const assignment = await this.submissionService.update(
      submissionId,
      payload as any,
    );
    if (assignment.isOk()) {
      return OperationResult.ok({
        assignment,
        role: req.headers['role'],
      });
    }
    return assignment;
  }

  @SubRoles(SubRole.STUDENT)
  @Delete('/:courseId/:assignmentId/:submissionId')
  async deleteSubmissions(
    @Param('assignmentId') assignmentId: string,
    @Param('submissionId') submissionId: string,
    @Request() req,
  ) {
    const result = await this.submissionService.removeSubmission(submissionId);
    return result;
  }

  @SubRoles(SubRole.STUDENT, SubRole.TEACHER)
  @Get('/:courseId/:assignmentId/:submissionId')
  async getSubmissionById(
    @Param('submissionId') submissionId: string,
    @Request() req,
  ) {
    const result = await this.submissionService.findOne(
      SubmissionResDto,
      submissionId,
    );
    if (result.isOk()) {
      return OperationResult.ok({
        submission: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }

  @SubRoles(SubRole.STUDENT, SubRole.TEACHER)
  @Get('/:courseId/:assignmentId')
  async getSubmissionsByAssignmentId(
    // @Param('submissionId') submissionId: string,
    @Param('assignmentId') assignmentId: string,
    @Request() req,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
  ) {
    const role = req.headers['role'];
    if (role === SubRole.TEACHER) {
      const result = await this.submissionService.findSubmissionsByAssigmentId(
        assignmentId,
        limit,
        offset,
      );
      return result;
    } else {
      const userId = req.headers['userId'];
      const result =
        await this.submissionService.findSubmissionsByAssigmentIdAndUserId(
          assignmentId,
          userId,
        );

      return result;
    }
  }

  //Moodle:
  @SubRoles(SubRole.TEACHER)
  @Get('/sync-submissions-by-assignment-id')
  async syncSubmissionsByAssignmentId(@Query() query: string, @Request() req) {
    const response$ = this.gSubmissionService
      .getSubmissionsByAssignmentId({
        assignmentMoodleId: query['assignmentMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const data = resultDTO.data.map((submission) => ({
      ...submission,
      timemodified: new Date(parseInt(submission.timemodified, 10) * 1000),
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
        submissions: result.data,
        role: req.headers['role'],
      });
    }
    return result;
  }
}
