import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

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
