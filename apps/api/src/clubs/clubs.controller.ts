import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ClubsService } from './clubs.service'
import { CreateClubDto } from './dto/create-club.dto'
import { UpdateClubDto } from './dto/update-club.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@ApiTags('Clubs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clubs')
export class ClubsController {
  constructor(private clubs: ClubsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new club (caller becomes OWNER)' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateClubDto) {
    return this.clubs.create(user.id, dto)
  }

  @Get(':clubId')
  @ApiOperation({ summary: 'Get club details' })
  findOne(@Param('clubId') clubId: string) {
    return this.clubs.findOne(clubId)
  }

  @Patch(':clubId')
  @ApiOperation({ summary: 'Update club (OWNER or MANAGER only)' })
  update(
    @Param('clubId') clubId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateClubDto,
  ) {
    return this.clubs.update(clubId, user.id, dto)
  }

  @Get(':clubId/members')
  @ApiOperation({ summary: 'List club members' })
  members(@Param('clubId') clubId: string) {
    return this.clubs.getMembers(clubId)
  }

  @Post(':clubId/members/invite')
  @ApiOperation({ summary: 'Invite a user to the club' })
  invite(
    @Param('clubId') clubId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { email: string; role: string },
  ) {
    return this.clubs.inviteMember(clubId, user.id, body.email, body.role)
  }

  @Patch(':clubId/members/:memberId')
  @ApiOperation({ summary: 'Change a member role (OWNER/MANAGER only)' })
  updateMember(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: { id: string },
    @Body('role') role: string,
  ) {
    return this.clubs.updateMember(clubId, memberId, user.id, role)
  }

  @Delete(':clubId/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the club (OWNER/MANAGER only)' })
  removeMember(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.clubs.removeMember(clubId, memberId, user.id)
  }
}
