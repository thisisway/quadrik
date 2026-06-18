import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ClubsModule } from './clubs/clubs.module'
import { CourtsModule } from './courts/courts.module'
import { BookingsModule } from './bookings/bookings.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 100 },
      { name: 'auth', ttl: 60_000, limit: 10 },
    ]),
    PrismaModule,
    AuthModule,
    ClubsModule,
    CourtsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
