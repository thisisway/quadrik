import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ClassesService } from './classes.service'
import { CreateClassDto } from './dto/create-class.dto'

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'clubs/:clubId/classes', version: '1' })
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get()
  findAll(@Param('clubId') clubId: string) {
    return this.classesService.findAll(clubId)
  }

  @Post()
  create(@Param('clubId') clubId: string, @Body() dto: CreateClassDto) {
    return this.classesService.create(clubId, dto)
  }

  @Patch(':classId/status')
  @HttpCode(200)
  updateStatus(
    @Param('clubId') clubId: string,
    @Param('classId') classId: string,
    @Body('status') status: string,
  ) {
    return this.classesService.updateStatus(clubId, classId, status)
  }

  @Delete(':classId')
  @HttpCode(200)
  remove(@Param('clubId') clubId: string, @Param('classId') classId: string) {
    return this.classesService.remove(clubId, classId)
  }
}
