import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookingDto } from './dto/create-booking.dto'

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(clubId: string, userId: string, dto: CreateBookingDto) {
    const start = new Date(dto.startTime)
    const end = new Date(dto.endTime)

    if (end <= start) throw new BadRequestException('endTime must be after startTime')

    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000)

    // Check court belongs to club
    const court = await this.prisma.court.findFirst({ where: { id: dto.courtId, clubId } })
    if (!court) throw new NotFoundException('Court not found')
    if (court.status !== 'active') throw new BadRequestException('Court is not available')

    // Check for conflicts
    const conflict = await this.prisma.booking.findFirst({
      where: {
        courtId: dto.courtId,
        status: { in: ['pending', 'confirmed'] },
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    })
    if (conflict) throw new ConflictException('Court already booked for this time slot')

    const booking = await this.prisma.booking.create({
      data: {
        clubId,
        courtId: dto.courtId,
        createdById: userId,
        startTime: start,
        endTime: end,
        durationMinutes,
        price: dto.price,
        paymentMethod: dto.paymentMethod,
        notes: dto.notes,
        status: 'confirmed',
        participants: {
          create: [
            { userId, isHost: true },
            ...(dto.participantIds ?? []).map((id) => ({ userId: id, isHost: false })),
          ],
        },
      },
      include: {
        court: { select: { id: true, name: true, sportType: true } },
        participants: { include: { user: { select: { id: true, name: true } } } },
      },
    })

    return booking
  }

  async findAll(clubId: string, filters: { courtId?: string; date?: string; startDate?: string; endDate?: string; status?: string }) {
    const where: any = { clubId }

    if (filters.courtId) where.courtId = filters.courtId
    if (filters.status) where.status = filters.status
    if (filters.startDate && filters.endDate) {
      where.startTime = { gte: new Date(filters.startDate), lt: new Date(filters.endDate) }
    } else if (filters.date) {
      const day = new Date(filters.date)
      const nextDay = new Date(day)
      nextDay.setDate(nextDay.getDate() + 1)
      where.startTime = { gte: day, lt: nextDay }
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        court: { select: { id: true, name: true, sportType: true } },
        createdBy: { select: { id: true, name: true } },
        participants: { include: { user: { select: { id: true, name: true } } } },
      },
      orderBy: { startTime: 'asc' },
    })
  }

  async findOne(clubId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, clubId },
      include: {
        court: true,
        createdBy: { select: { id: true, name: true, email: true } },
        participants: { include: { user: { select: { id: true, name: true } } } },
      },
    })
    if (!booking) throw new NotFoundException('Booking not found')
    return booking
  }

  async cancel(clubId: string, bookingId: string, userId: string) {
    const booking = await this.findOne(clubId, bookingId)

    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new BadRequestException('Booking cannot be cancelled')
    }

    const isStaff = await this.isStaff(clubId, userId)
    if (!isStaff && booking.createdById !== userId) {
      throw new ForbiddenException('Cannot cancel this booking')
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledById: userId,
      },
    })
  }

  async updateStatus(clubId: string, bookingId: string, userId: string, status: string) {
    await this.findOne(clubId, bookingId)
    await this.assertStaff(clubId, userId)

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
    })
  }

  private async isStaff(clubId: string, userId: string) {
    const m = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    })
    return m && ['OWNER', 'MANAGER', 'RECEPTIONIST'].includes(m.role)
  }

  private async assertStaff(clubId: string, userId: string) {
    if (!(await this.isStaff(clubId, userId))) {
      throw new ForbiddenException('Staff access required')
    }
  }
}
