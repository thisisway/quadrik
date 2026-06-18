import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { CourtsService } from './courts.service'
import { CreateCourtDto } from './dto/create-court.dto'
import { UpdateCourtDto } from './dto/update-court.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@ApiTags('Courts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clubs/:clubId/courts')
export class CourtsController {
  constructor(private courts: CourtsService) {}

  @Get()
  @ApiOperation({ summary: 'List all courts in a club' })
  findAll(@Param('clubId') clubId: string) {
    return this.courts.findAll(clubId)
  }

  @Get(':courtId')
  @ApiOperation({ summary: 'Get court details' })
  findOne(@Param('clubId') clubId: string, @Param('courtId') courtId: string) {
    return this.courts.findOne(clubId, courtId)
  }

  @Post()
  @ApiOperation({ summary: 'Create a court (staff only)' })
  create(
    @Param('clubId') clubId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCourtDto,
  ) {
    return this.courts.create(clubId, user.id, dto)
  }

  @Patch(':courtId')
  @ApiOperation({ summary: 'Update a court (staff only)' })
  update(
    @Param('clubId') clubId: string,
    @Param('courtId') courtId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateCourtDto,
  ) {
    return this.courts.update(clubId, courtId, user.id, dto)
  }

  @Delete(':courtId')
  @ApiOperation({ summary: 'Deactivate a court (staff only)' })
  remove(
    @Param('clubId') clubId: string,
    @Param('courtId') courtId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.courts.remove(clubId, courtId, user.id)
  }

  @Get(':courtId/availability')
  @ApiOperation({ summary: 'Get court availability for a date' })
  @ApiQuery({ name: 'date', description: 'ISO date string (YYYY-MM-DD)' })
  availability(
    @Param('clubId') clubId: string,
    @Param('courtId') courtId: string,
    @Query('date') date: string,
  ) {
    return this.courts.getAvailability(clubId, courtId, date)
  }
}
