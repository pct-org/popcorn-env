import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { ConfigService } from './shared/config/config.service'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ConfigService.logLevel
    }
  )

  const configService = app.get('ConfigService')

  await app.listen(
    configService.get(ConfigService.PORT),
    '0.0.0.0'
  )

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
