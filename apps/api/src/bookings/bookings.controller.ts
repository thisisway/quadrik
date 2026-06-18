import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clubs/:clubId/bookings')
export class BookingsController {
  constructor(private bookings: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking' })
  create(
    @Param('clubId') clubId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookings.create(clubId, user.id, dto)
  }

  @Get()
  @ApiOperation({ summary: 'List bookings (filterable by court, date, status)' })
  @ApiQuery({ name: 'courtId', required: false })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Param('clubId') clubId: string,
    @Query('courtId') courtId?: string,
    @Query('date') date?: string,
    @Query('status') status?: string,
  ) {
    return this.bookings.findAll(clubId, { courtId, date, status })
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get booking details' })
  findOne(@Param('clubId') clubId: string, @Param('bookingId') bookingId: string) {
    return this.bookings.findOne(clubId, bookingId)
  }

  @Patch(':bookingId/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(
    @Param('clubId') clubId: string,
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.bookings.cancel(clubId, bookingId, user.id)
  }

  @Patch(':bookingId/status')
  @ApiOperation({ summary: 'Update booking status (staff only)' })
  updateStatus(
    @Param('clubId') clubId: string,
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: { id: string },
    @Body('status') status: string,
  ) {
    return this.bookings.updateStatus(clubId, bookingId, user.id, status)
  }
}
