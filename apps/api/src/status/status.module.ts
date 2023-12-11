import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { StatusResolver } from './status.resolver'
import { StatusService } from './status.service'
import { StatusController } from './status.controller'

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000
    })
  ],
  providers: [StatusResolver, StatusService],
  controllers: [StatusController]
})
export class StatusModule {}
