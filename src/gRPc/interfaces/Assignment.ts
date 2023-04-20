import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export interface Assignment {
  name: string;
  dueDate: string;
  status: boolean;
  courseId: string;
  description: string | null;
  attachmentFileLink: string | null;
  config: string;
  assignmentMoodleId: string;
}

export class GetAssignmentsOfCourseRequest {
  @IsNumber()
  @Min(1)
  courseMoodleId: number;
}

export interface AssignmentsResponce {
  error: number;
  data: Assignment[];
}

export class AssignmentCronjobRequest {
  @IsString()
  @MinLength(1)
  id: string;

  @IsNumber()
  @Min(1)
  assignmentMoodleId: number;

  @IsString()
  @MinLength(1)
  dueDate: string;
}

export class AssignmentsCronjobRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentCronjobRequest)
  assignments: AssignmentCronjobRequest[];
}
