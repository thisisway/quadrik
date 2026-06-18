import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDateString, IsNumber, IsOptional, IsArray } from 'class-validator'

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  courtId: string

  @ApiProperty({ description: 'ISO datetime string' })
  @IsDateString()
  startTime: string

  @ApiProperty({ description: 'ISO datetime string' })
  @IsDateString()
  endTime: string

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string

  @ApiProperty({ type: [String], required: false, description: 'Array of user IDs as participants' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  participantIds?: string[]
}
