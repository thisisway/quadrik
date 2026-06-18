import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateClubDto } from './dto/create-club.dto'
import { UpdateClubDto } from './dto/update-club.dto'

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateClubDto) {
    const slugTaken = await this.prisma.club.findUnique({ where: { slug: dto.slug } })
    if (slugTaken) throw new ConflictException('Slug already in use')

    return this.prisma.club.create({
      data: {
        ...dto,
        members: {
          create: { userId, role: 'OWNER', status: 'active', joinedAt: new Date() },
        },
      },
    })
  }

  async findOne(clubId: string) {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      include: {
        _count: { select: { courts: true, members: true } },
      },
    })
    if (!club) throw new NotFoundException('Club not found')
    return club
  }

  async update(clubId: string, userId: string, dto: UpdateClubDto) {
    await this.assertMembership(clubId, userId, ['OWNER', 'MANAGER'])

    if (dto.slug) {
      const taken = await this.prisma.club.findFirst({
        where: { slug: dto.slug, NOT: { id: clubId } },
      })
      if (taken) throw new ConflictException('Slug already in use')
    }

    return this.prisma.club.update({ where: { id: clubId }, data: dto })
  }

  async getMembers(clubId: string) {
    return this.prisma.clubMember.findMany({
      where: { clubId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      orderBy: { joinedAt: 'asc' },
    })
  }

  async inviteMember(clubId: string, inviterId: string, targetEmail: string, role: string) {
    await this.assertMembership(clubId, inviterId, ['OWNER', 'MANAGER'])

    const target = await this.prisma.user.findUnique({ where: { email: targetEmail } })
    if (!target) throw new NotFoundException('User not found')

    const existing = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId: target.id } },
    })
    if (existing) throw new ConflictException('User is already a member')

    return this.prisma.clubMember.create({
      data: { clubId, userId: target.id, role: role as any, status: 'invited', invitedBy: inviterId },
    })
  }

  private async assertMembership(clubId: string, userId: string, roles: string[]) {
    const m = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    })
    if (!m || !roles.includes(m.role)) throw new ForbiddenException('Insufficient permissions')
  }
}
