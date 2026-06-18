import { PartialType } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateCourtDto } from './create-court.dto'

export class UpdateCourtDto extends PartialType(CreateCourtDto) {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'maintenance'] })
  @IsOptional()
  @IsString()
  status?: string
}
