import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'

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

  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get(ConfigService.PORT)

  await app.listen(port, '0.0.0.0').then(() => {
    Logger.log(`Server running on http://localhost:${port}`)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
