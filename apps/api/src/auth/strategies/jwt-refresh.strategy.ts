import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { PrismaService } from '../../prisma/prisma.service'
import { JwtPayload } from './jwt.strategy'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user || user.status !== 'active') throw new UnauthorizedException()
    return { id: user.id, email: user.email, clubId: payload.clubId, role: payload.role }
  }
}
