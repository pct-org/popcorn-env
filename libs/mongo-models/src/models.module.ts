import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { movieSchema } from './movie/movie.schema'
import { showSchema } from './show/show.schema'
import { seasonSchema } from './season/season.schema'
import { episodeSchema } from './episode/episode.schema'
import { downloadSchema } from './download/download.schema'
import { blacklistSchema } from './blacklist/blacklist.schema'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movies', schema: movieSchema }]),
    MongooseModule.forFeature([{ name: 'Shows', schema: showSchema }]),
    MongooseModule.forFeature([{ name: 'Seasons', schema: seasonSchema }]),
    MongooseModule.forFeature([{ name: 'Episodes', schema: episodeSchema }]),
    MongooseModule.forFeature([{ name: 'Downloads', schema: downloadSchema }]),
    MongooseModule.forFeature([{ name: 'Blacklist', schema: blacklistSchema }])
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Movies', schema: movieSchema }]),
    MongooseModule.forFeature([{ name: 'Shows', schema: showSchema }]),
    MongooseModule.forFeature([{ name: 'Seasons', schema: seasonSchema }]),
    MongooseModule.forFeature([{ name: 'Episodes', schema: episodeSchema }]),
    MongooseModule.forFeature([{ name: 'Downloads', schema: downloadSchema }]),
    MongooseModule.forFeature([{ name: 'Blacklist', schema: blacklistSchema }])
  ]
})
export class ModelsModule {
}
