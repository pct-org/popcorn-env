import { Global, HttpModule, Module } from '@nestjs/common'

import { SearchService } from './search.service'

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    SearchService
  ],
  exports: [
    SearchService
  ]
})
export class SearchModule {
}
