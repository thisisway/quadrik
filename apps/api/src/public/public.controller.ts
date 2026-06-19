import { Controller, Get, Param, NotFoundException } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private prisma: PrismaService) {}

  @Get('clubs/:slug')
  @ApiOperation({ summary: 'Get public club info by slug (no auth required)' })
  async findBySlug(@Param('slug') slug: string) {
    const club = await this.prisma.club.findUnique({
      where: { slug },
      include: {
        courts: {
          where: { status: 'active' },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            sportType: true,
            surfaceType: true,
            playerCapacity: true,
            pricePerHour: true,
            status: true,
          },
        },
        _count: { select: { members: { where: { status: 'active' } } } },
      },
    })

    if (!club || !club.isPublic || club.status !== 'active') {
      throw new NotFoundException('Club not found')
    }

    return club
  }
}
