import { Module, Global } from '@nestjs/common'
import { PubSubService } from './pub-sub.service'

@Global()
@Module({
  providers: [PubSubService],
  exports: [PubSubService]
})
export class PubSubModule {
}
