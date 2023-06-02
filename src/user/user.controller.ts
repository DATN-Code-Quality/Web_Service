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
  Request,
  DefaultValuePipe,
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
import { Public, Roles } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/auth.const';
import { User } from 'src/gRPc/interfaces/User';
import { USER_STATUS } from './req/user-req.dto';
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

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post('/import-sync-users')
  async syncUsers(
    @Body(new ParseArrayPipe({ items: UserReqDto })) users: User[],
  ) {
    const result = await this.userService.upsertUsers(users);
    if (result.status === 0) {
      users.forEach(async (user) => await this.userService.sendEmail(user));
    }
    return result;
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post('/')
  async addUser(@Body() user: UserReqDto) {
    user.status = USER_STATUS.ACTIVE;
    const result = await this.userService.addUsers([user]);
    if (result.status === 0) {
      await this.userService.sendEmail(user);
    }
    return result;
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post('/users')
  async addUsers(
    @Body(new ParseArrayPipe({ items: UserReqDto })) users: UserReqDto[],
  ) {
    for (let i = 0; i < users.length; i++) {
      users[i].status = USER_STATUS.ACTIVE;
    }
    const result = await this.userService.addUsers(users);
    return result;
  }
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Put('/change-status')
  async changeStatus(@Body() data) {
    const ids = data['ids'];
    const status = data['status'];
    return this.userService.changeStatus(ids, status);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
  @Put('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() userInfo: UserReqDto,
  ) {
    const result = await this.userService.updateUser(userId, userInfo);
    return result;
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const result = await this.userService.remove(userId);
    return result;
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('/all-users')
  async getAllUsers(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('userId', new DefaultValuePipe('')) userId: string,
    @Query('role', new DefaultValuePipe(null)) role: string,
    @Query('status', new DefaultValuePipe(null)) status: USER_STATUS,
    @Query('limit', new DefaultValuePipe(null)) limit: number,
    @Query('offset', new DefaultValuePipe(null)) offset: number,
  ) {
    const result = await this.userService.findAllUsers(
      search,
      userId,
      role,
      status,
      limit,
      offset,
    );
    return result;
  }

  //Moodle:

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('/sync-users-by-email')
  async getUserByEmail(@Body() emails: string[]) {
    const response$ = this.gUserMoodleService.getUsersByEmails({ emails });
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('/sync-users')
  async getAllMoodleUsers() {
    const response$ = this.gUserMoodleService.getAllUsers({}).pipe();
    const resultDTO = await firstValueFrom(response$);
    const result = ServiceResponse.resultFromServiceResponse(resultDTO, 'data');
    return result;
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
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

  @Post('/import')
  async importuser(@Body() users: UserReqDto[]) {
    return this.userService.upsertUsers(users);
  }
}
