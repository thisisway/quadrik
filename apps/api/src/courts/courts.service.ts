import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourtDto } from './dto/create-court.dto'
import { UpdateCourtDto } from './dto/update-court.dto'

@Injectable()
export class CourtsService {
  constructor(private prisma: PrismaService) {}

  async findAll(clubId: string) {
    return this.prisma.court.findMany({
      where: { clubId },
      include: { schedules: true },
      orderBy: { sortOrder: 'asc' },
    })
  }

  async findOne(clubId: string, courtId: string) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
      include: { schedules: true },
    })
    if (!court) throw new NotFoundException('Court not found')
    return court
  }

  async create(clubId: string, userId: string, dto: CreateCourtDto) {
    await this.assertStaff(clubId, userId)
    return this.prisma.court.create({
      data: { ...dto, clubId },
    })
  }

  async update(clubId: string, courtId: string, userId: string, dto: UpdateCourtDto) {
    await this.assertStaff(clubId, userId)
    await this.findOne(clubId, courtId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.court.update({ where: { id: courtId }, data: dto as any })
  }

  async remove(clubId: string, courtId: string, userId: string) {
    await this.assertStaff(clubId, userId)
    await this.findOne(clubId, courtId)
    return this.prisma.court.update({
      where: { id: courtId },
      data: { status: 'inactive' },
    })
  }

  async getAvailability(clubId: string, courtId: string, date: string) {
    await this.findOne(clubId, courtId)

    const dayStart = new Date(`${date}T00:00:00.000Z`)
    const dayEnd = new Date(`${date}T23:59:59.999Z`)

    const bookings = await this.prisma.booking.findMany({
      where: {
        courtId,
        startTime: { gte: dayStart, lte: dayEnd },
        status: { in: ['pending', 'confirmed'] },
      },
      select: { startTime: true, endTime: true, status: true },
      orderBy: { startTime: 'asc' },
    })

    return { courtId, date, bookedSlots: bookings }
  }

  private async assertStaff(clubId: string, userId: string) {
    const m = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    })
    const staffRoles = ['OWNER', 'MANAGER', 'RECEPTIONIST']
    if (!m || !staffRoles.includes(m.role)) throw new ForbiddenException('Staff access required')
  }
}
