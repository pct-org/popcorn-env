import { Module, Global } from '@nestjs/common'

import { ShowHelperService } from './show-helper.service'

@Global()
@Module({
  providers: [ShowHelperService],
  exports: [ShowHelperService]
})
export class ShowHelperModule {
}
