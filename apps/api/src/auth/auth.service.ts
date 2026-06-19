import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email already in use')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? null,
        passwordHash,
        profile: { create: {} },
      },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })

    return { user, ...this.generateTokens(user.id, null, null) }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')
    if (user.status !== 'active') throw new UnauthorizedException('Account is not active')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    // Load the user's primary club membership (first OWNER or MANAGER role)
    const membership = await this.prisma.clubMember.findFirst({
      where: { userId: user.id, status: 'active' },
      orderBy: { joinedAt: 'desc' },
    })

    const tokens = this.generateTokens(user.id, membership?.clubId ?? null, membership?.role ?? null)

    return {
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      clubId: membership?.clubId ?? null,
      role: membership?.role ?? null,
      ...tokens,
    }
  }

  async refresh(userId: string, clubId: string | null, role: string | null) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.status !== 'active') throw new UnauthorizedException()
    return this.generateTokens(userId, clubId, role)
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        profile: true,
        memberships: {
          where: { status: 'active' },
          include: { club: { select: { id: true, name: true, slug: true, logoUrl: true } } },
        },
      },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name, phone: dto.phone ?? null },
      select: { id: true, name: true, email: true, phone: true },
    })
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Current password is incorrect')

    const newHash = await bcrypt.hash(dto.newPassword, 12)
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } })

    return { message: 'Password changed successfully' }
  }

  private generateTokens(userId: string, clubId: string | null, role: string | null) {
    const payload = { sub: userId, email: undefined, clubId, role }

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: '15m',
    })

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  }
}
