import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, MaxLength } from 'class-validator'

export class CreateClubDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  slug: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  whatsapp?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  state?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  zipCode?: string

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sportTypes?: string[]

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean
}
