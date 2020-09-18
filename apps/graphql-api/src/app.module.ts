import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { MongooseModule } from '@nestjs/mongoose'

import { ConfigModule } from './shared/config/config.module'
import { ConfigService } from './shared/config/config.service'
import { ModelsModule } from './shared/models/models.module'
import { TorrentModule } from './shared/torrent/torrent.module'
import { PubSubModule } from './shared/pub-sub/pub-sub.module'

import { StatusModule } from './status/status.module'
import { CalendarModule } from './calendar/calendar.module'
import { SubtitleModule } from './subtitle/subtitle.module'
import { MoviesModule } from './movies/movies.module'
import { ShowsModule } from './shows/shows.module'
import { SeasonsModule } from './seasons/seasons.module'
import { BookmarksModule } from './bookmarks/bookmarks.module'
import { DownloadsModule } from './downloads/downloads.module'
import { EpisodesModule } from './episodes/episodes.module'
import { ProgressModule } from './progress/progress.module'
import { WatchOnTvModule } from './watch-on-tv/watch-on-tv.module'
import { SearchBetterModule } from './search-better/search-better.module'

import { WatchModule } from './watch/watch.module'

@Module({
  imports: [
    ModelsModule,
    ConfigModule,
    TorrentModule,
    PubSubModule,

    // GraphQL
    StatusModule,
    MoviesModule,
    ShowsModule,
    SeasonsModule,
    BookmarksModule,
    DownloadsModule,
    EpisodesModule,
    ProgressModule,
    WatchOnTvModule,
    SearchBetterModule,

    // Rest
    WatchModule,
    CalendarModule,
    SubtitleModule,

    // Enable Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.databaseUri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
    }),

    // Enable Graphql
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      introspection: true
    })
  ]
})
export class AppModule {
}
