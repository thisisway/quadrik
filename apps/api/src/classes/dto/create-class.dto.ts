import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
  MinLength,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ScheduleItemDto {
  @ApiProperty() @IsInt() @Min(0) @Max(6) dayOfWeek: number
  @ApiProperty() @IsString() startTime: string
  @ApiProperty() @IsString() endTime: string
}

export class CreateClassDto {
  @ApiProperty() @IsString() @MinLength(2) name: string
  @ApiProperty() @IsString() sportType: string
  @ApiProperty() @IsString() @IsIn(['beginner', 'intermediate', 'advanced']) level: string
  @ApiProperty() @IsString() teacherUserId: string
  @ApiPropertyOptional() @IsOptional() @IsString() courtId?: string
  @ApiProperty() @IsInt() @Min(1) maxStudents: number
  @ApiProperty() @IsNumber() @Min(0) pricePerMonth: number
  @ApiProperty({ type: [ScheduleItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => ScheduleItemDto)
  schedule: ScheduleItemDto[]
  @ApiProperty() @IsString() startDate: string
  @ApiPropertyOptional() @IsOptional() @IsString() endDate?: string
}
