import { IsString, IsOptional, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string
}
