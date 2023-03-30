import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BaseDto {
  @ApiProperty()
  @IsString()
  id: string;
}
