import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
import { GSonarqubeService } from 'src/gRPc/services/sonarqube';
import { firstValueFrom } from 'rxjs';

@ApiTags('Sonarqube')
@Controller('/api/sonarqube')
export class SonarqubeController implements OnModuleInit {
  private clientService: GSonarqubeService;

  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GSonarqubeService>('GSonarqubeService');
  }

  @Roles(Role.USER)
  @Get('source/:key')
  async getSourceByKey(@Param('key') key: string) {
    const result = await this.clientService.getSourcesByKey({ key: key });
    const issue = await firstValueFrom(result);
    return {
      status: issue.error,
      data: issue.data,
      message: issue.message,
    };
  }

  // @Roles(Role.USER)
  // @Get('issue/:submissionId')
  // async getIssuesByKey(
  //   @Param('submissionId') submissionId: string,
  //   @Query('type', new DefaultValuePipe(null)) type: string,
  //   @Query('severity', new DefaultValuePipe(null)) severity: string,
  //   @Query('rule', new DefaultValuePipe(null)) rule: string,
  //   @Query('file', new DefaultValuePipe(null)) file: string,

  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
  //   pageSize: number,
  // ) {
  //   const result = await this.clientService.getIssuesBySubmissionId({
  //     submissionId: submissionId,
  //     page: page,
  //     pageSize: pageSize,
  //     type: type,
  //     severity: severity,
  //     rule: rule,
  //     file: file,
  //   });

  //   const issue = await firstValueFrom(result);
  //   return {
  //     status: issue.error,
  //     data: issue.data,
  //     message: issue.message,
  //   };
  // }

  @Roles(Role.USER)
  @Get('rule/:key')
  async getRuleDetailByKey(@Param('key') key: string) {
    const result = await this.clientService.getRuleDetailByKey({
      key: key,
    });
    const issue = await firstValueFrom(result);
    return {
      status: issue.error,
      data: issue.data,
      message: issue.message,
    };
  }

  // @Roles(Role.USER)
  // @Get('result/:submissionId')
  // async getResultsByKey(
  //   @Param('submissionId') submissionId: string,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
  //   pageSize: number,
  // ) {
  //   const result = await this.clientService.getResultsBySubmissionId({
  //     submissionId: submissionId,
  //     page: page,
  //     pageSize: pageSize,
  //   });
  //   const issue = await firstValueFrom(result);
  //   return {
  //     status: issue.error,
  //     data: issue.data,
  //     message: issue.message,
  //   };
  // }

  @Roles(Role.USER)
  @Get('issue/:courseId/:assignmentId/:submissionId')
  async getIssuesBySubmissionId(
    @Param('submissionId') submissionId: string,
    @Query('type', new DefaultValuePipe(null)) type: string,
    @Query('severity', new DefaultValuePipe(null)) severity: string,
    @Query('rule', new DefaultValuePipe(null)) rule: string,
    @Query('file', new DefaultValuePipe(null)) file: string,
    @Query('fileuuid', new DefaultValuePipe(null)) fileuuid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ) {
    const result = await this.clientService.getIssuesBySubmissionId({
      submissionId: submissionId,
      page: page,
      pageSize: pageSize,
      type: type,
      severity: severity,
      rule: rule,
      file: file,
      fileuuid: fileuuid,
    });

    const issue = await firstValueFrom(result);
    return {
      status: issue.error,
      data: issue.data,
      message: issue.message,
    };
  }

  @Roles(Role.USER)
  @Get('result/:courseId/:assignmentId/:submissionId')
  async getResultsBySubmissionId(
    @Param('submissionId') submissionId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ) {
    const result = await this.clientService.getResultsBySubmissionId({
      submissionId: submissionId,
      page: page,
      pageSize: pageSize,
    });
    const issue = await firstValueFrom(result);
    return {
      status: issue.error,
      data: issue.data,
      message: issue.message,
    };
  }

  @Roles(Role.USER)
  @Get('component/:courseId/:assignmentId/:submissionId')
  async getComponentsBySubmissionId(
    @Param('submissionId') submissionId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ) {
    const result = await this.clientService.getComponentsBySubmissionId({
      submissionId: submissionId,
      page: page,
      pageSize: pageSize,
    });
    const issue = await firstValueFrom(result);
    return {
      status: issue.error,
      data: issue.data,
      message: issue.message,
    };
  }
}
