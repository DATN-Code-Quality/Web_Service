import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionResDto } from './res/submission-res.dto';
import { SubmissionService } from './submission.service';
import { SubmissionReqDto } from './req/submission-req.dto';
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
          const path = `D:/source/${courseId}/${assignmentId}/${userId}`;
          req.body['link'] = `${path}/${file.originalname}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }
          cb(null, path);
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @Post('/:courseId/:assignmentId')
  async addSubmission(
    @UploadedFile() file: Express.Multer.File,
    @Param('assignmentId') assignmentId: string,
    @Body() submission: SubmissionReqDto,
    @Request() req,
  ) {
    submission.assignmentId = assignmentId;
    submission.userId = req.headers['userId'];

    // const result = await this.submissionService.create(
    //   SubmissionResDto,
    //   submission,
    // );

    const result = await this.submissionService.upserSubmission(submission);

    firstValueFrom(this.gSubmissionService.scanSubmission(submission).pipe());
    return result;
  }

  // @SubRoles(SubRole.STUDENT)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: function (req, file, cb) {
  //         const courseId = req.params['courseId'];
  //         const assignmentId = req.params['assignmentId'];
  //         const userId = req.headers['userId'];
  //         const path = `D:/source/${courseId}/${assignmentId}/${userId}`;
  //         req.body['link'] = `${path}/${file.originalname}`;
  //         console.log(req.body);
  //         if (!fs.existsSync(path)) {
  //           fs.mkdirSync(path, { recursive: true });
  //         }
  //         cb(null, path);
  //       },
  //       filename: function (req, file, cb) {
  //         cb(null, file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // @Put('/:courseId/:assignmentId/:submissionId')
  // async updateSubmissions(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('assignmentId') assignmentId: string,
  //   @Param('submissionId') submissionId: string,

  //   @Body() submission: SubmissionReqDto,
  //   @Request() req,
  // ) {
  //   console.log(submission);

  //   if (submission.assignmentId !== assignmentId) {
  //     return OperationResult.error(
  //       new Error('assignmentId in submissions invalid'),
  //     );
  //   }
  //   // if (submission.id !== submissionId) {
  //   //   return OperationResult.error(
  //   //     new Error('submissionId in submissions invalid'),
  //   //   );
  //   // }

  //   submission.userId = req.headers['userId'];
  //   console.log(submission);

  //   const result = await this.submissionService.update(
  //     submission.id,
  //     submission,
  //   );

  //   if (submission.link) {
  //     const updatedSubmission = await this.submissionService.findOne(
  //       SubmissionResDto,
  //       submission.id,
  //     );
  //     if (updatedSubmission.status == 0) {
  //       firstValueFrom(
  //         this.gSubmissionService.scanSubmission(updatedSubmission.data).pipe(),
  //       );
  //     }
  //   }

  //   return result;
  // }

  @SubRoles(SubRole.STUDENT)
  @Delete('/:courseId/:assignmentId/:submissionId')
  async deleteSubmissions(
    @Param('assignmentId') assignmentId: string,
    @Param('submissionId') submissionId: string,
  ) {
    const result = await this.submissionService.removeSubmission(submissionId);

    return result;
  }

  @SubRoles(SubRole.STUDENT, SubRole.TEACHER)
  @Get('/:courseId/:assignmentId/:submissionId')
  async getSubmissionById(@Param('submissionId') submissionId: string) {
    const result = await this.submissionService.findOne(
      SubmissionResDto,
      submissionId,
    );
    return result;
  }

  @SubRoles(SubRole.STUDENT, SubRole.TEACHER)
  @Get('/:courseId/:assignmentId')
  async getSubmissionsByAssignmentId(
    // @Param('submissionId') submissionId: string,
    @Param('assignmentId') assignmentId: string,
    @Request() req,
  ) {
    const role = req.headers['role'];
    if (role === SubRole.TEACHER) {
      const result = await this.submissionService.findSubmissionsByAssigmentId(
        assignmentId,
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
  async syncSubmissionsByAssignmentId(@Query() query: string) {
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
    return result;
  }
}
