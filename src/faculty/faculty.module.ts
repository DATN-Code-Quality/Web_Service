import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { ResultModule } from 'src/result/project.module';

@Module({
  imports: [],
  controllers: [FacultyController],
  providers: [
    FacultyService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [FacultyService],
})
export class FacultyModule {}
