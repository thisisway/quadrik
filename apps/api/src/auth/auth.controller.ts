import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from './decorators/current-user.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @Throttle({ auth: {} })
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Post('login')
  @Throttle({ auth: {} })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT tokens' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@CurrentUser() user: { id: string; clubId: string | null; role: string | null }) {
    return this.auth.refresh(user.id, user.clubId, user.role)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: { id: string }) {
    return this.auth.me(user.id)
  }
}
