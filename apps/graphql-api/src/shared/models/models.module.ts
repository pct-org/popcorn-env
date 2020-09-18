import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { movieSchema, showSchema, seasonSchema, episodeSchema, downloadSchema } from '@pct-org/mongo-models'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movies', schema: movieSchema }]),
    MongooseModule.forFeature([{ name: 'Shows', schema: showSchema }]),
    MongooseModule.forFeature([{ name: 'Seasons', schema: seasonSchema }]),
    MongooseModule.forFeature([{ name: 'Episodes', schema: episodeSchema }]),
    MongooseModule.forFeature([{ name: 'Downloads', schema: downloadSchema }])
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Movies', schema: movieSchema }]),
    MongooseModule.forFeature([{ name: 'Shows', schema: showSchema }]),
    MongooseModule.forFeature([{ name: 'Seasons', schema: seasonSchema }]),
    MongooseModule.forFeature([{ name: 'Episodes', schema: episodeSchema }]),
    MongooseModule.forFeature([{ name: 'Downloads', schema: downloadSchema }])
  ]
})
export class ModelsModule {
}
