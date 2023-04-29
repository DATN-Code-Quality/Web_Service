import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  OnModuleInit,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserReqDto } from './req/user-req.dto';
import { UserResDto } from './res/user-res.dto';
import { GUserService } from 'src/gRPc/services/user';
import { GCourseService } from 'src/gRPc/services/course';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/common/service-response';
import { Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
export const SALTROUNDS = 10;
@ApiTags('User')
@Controller('/api/user')
export class UserController implements OnModuleInit {
  private gUserMoodleService: GUserService;
  private gCourseMoodleService: GCourseService;
  constructor(
    @Inject('THIRD_PARTY_SERVICE') private readonly client: ClientGrpc,
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.gUserMoodleService =
      this.client.getService<GUserService>('GUserService');
    this.gCourseMoodleService =
      this.client.getService<GCourseService>('GCourseService');
  }

  @Roles(Role.ADMIN)
  @Post('/users')
  async addUsers(
    @Body(new ParseArrayPipe({ items: UserReqDto })) users: UserReqDto[],
  ) {
    const result = await this.userService.addUsers(users);
    return result;
  }

  // @Roles(Role.ADMIN)
  @Put('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() userInfo: UserReqDto,
  ) {
    const result = await this.userService.update(userId, userInfo);
    return result;
  }

  @Roles(Role.ADMIN)
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const result = await this.userService.remove(userId);
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/users')
  async getAllUsers() {
    const result = await this.userService.findAll(UserResDto);
    return result;
  }

  //Moodle:

  @Roles(Role.ADMIN)
  @Get('/sync-users-by-email')
  async getUserByEmail(@Body() emails: string[]) {
    const response$ = this.gUserMoodleService.getUsersByEmails({ emails });
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/sync-users')
  async getAllMoodleUsers() {
    const response$ = this.gUserMoodleService.getAllUsers({}).pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }

  @Roles(Role.ADMIN)
  @Get('/sync-users')
  async getUserCourse(@Query() query: string) {
    // ban đầu nhờ client truyền id dùm, nhưng sau thì thông tin này phải lấy từ session
    const response$ = this.gCourseMoodleService
      .getUsersCourse({
        userMoodleId: query['userMoodleId'],
      })
      .pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }
}
