import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'

export class RegisterDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string
}
