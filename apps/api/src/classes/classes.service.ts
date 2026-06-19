import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateClassDto } from './dto/create-class.dto'
import { type Class, type Teacher, type User, Prisma } from '@prisma/client'

type ClassRow = Class & {
  teacher: Teacher
  _count: { students: number }
}

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll(clubId: string) {
    const classes: ClassRow[] = await this.prisma.class.findMany({
      where: { clubId },
      include: {
        teacher: true,
        _count: { select: { students: { where: { status: 'active' } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const teacherUserIds = [...new Set(classes.map((c) => c.teacher.userId))]
    const users: Pick<User, 'id' | 'name' | 'avatarUrl'>[] =
      teacherUserIds.length > 0
        ? await this.prisma.user.findMany({
            where: { id: { in: teacherUserIds } },
            select: { id: true, name: true, avatarUrl: true },
          })
        : []

    const userMap = new Map(users.map((u) => [u.id, u]))

    return classes.map((c) => ({
      ...c,
      teacher: { ...c.teacher, user: userMap.get(c.teacher.userId) ?? null },
    }))
  }

  async create(clubId: string, dto: CreateClassDto) {
    let teacher = await this.prisma.teacher.findFirst({
      where: { clubId, userId: dto.teacherUserId },
    })

    if (!teacher) {
      teacher = await this.prisma.teacher.create({
        data: {
          userId: dto.teacherUserId,
          clubId,
          sports: [dto.sportType],
          commissionRate: 0,
          status: 'active',
        },
      })
    }

    return this.prisma.class.create({
      data: {
        clubId,
        teacherId: teacher.id,
        courtId: dto.courtId ?? null,
        name: dto.name,
        sportType: dto.sportType,
        level: dto.level as 'beginner' | 'intermediate' | 'advanced',
        maxStudents: dto.maxStudents,
        pricePerMonth: dto.pricePerMonth,
        schedule: dto.schedule as unknown as Prisma.InputJsonValue,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    })
  }

  async updateStatus(clubId: string, classId: string, status: string) {
    const cls = await this.prisma.class.findFirst({ where: { id: classId, clubId } })
    if (!cls) throw new NotFoundException('Class not found')
    return this.prisma.class.update({ where: { id: classId }, data: { status } })
  }

  async remove(clubId: string, classId: string) {
    const cls = await this.prisma.class.findFirst({ where: { id: classId, clubId } })
    if (!cls) throw new NotFoundException('Class not found')
    return this.prisma.class.delete({ where: { id: classId } })
  }
}
