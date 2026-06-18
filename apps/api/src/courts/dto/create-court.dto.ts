import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsNumber, IsOptional, IsInt, Min } from 'class-validator'

export class CreateCourtDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  sportType: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  surfaceType?: string

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isIndoor?: boolean

  @ApiProperty({ default: 4 })
  @IsInt()
  @Min(1)
  @IsOptional()
  playerCapacity?: number

  @ApiProperty()
  @IsNumber()
  pricePerHour: number

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photoUrl?: string

  @ApiProperty({ default: 0 })
  @IsInt()
  @IsOptional()
  sortOrder?: number
}
