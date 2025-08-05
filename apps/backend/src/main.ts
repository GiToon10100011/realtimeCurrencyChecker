import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  
  const app = await NestFactory.create(AppModule)
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }))
  
  const port = process.env.PORT || 3001
  await app.listen(port)
  
  logger.log(`🚀 Currency Dashboard Backend running on http://localhost:${port}`)
  logger.log(`📊 WebSocket server running on ws://localhost:${port}`)
}

bootstrap()
