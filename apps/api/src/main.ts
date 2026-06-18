import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configuredOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) ?? []
  const devOrigins = ['http://localhost:3000', 'http://localhost:3001']
  const allowedOrigins = new Set([...configuredOrigins, ...devOrigins])

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    },
    credentials: true,
  })

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Quadrik API')
    .setDescription('REST API for the Quadrik sports management platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  console.log(`Quadrik API running on http://localhost:${port}`)
  console.log(`Swagger docs: http://localhost:${port}/docs`)
}

void bootstrap()
