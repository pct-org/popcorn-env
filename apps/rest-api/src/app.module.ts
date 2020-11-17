import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ModelsModule } from './shared/models.module'
import { ConfigModule } from './shared/config/config.module'
import { ConfigService } from './shared/config/config.service'

import { MoviesModule } from './routes/movies/movies.module'
import { ShowsModule } from './routes/shows/shows.module'

@Module({
  imports: [
    ModelsModule,
    ConfigModule,

    // Routes
    MoviesModule,
    ShowsModule,

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
    })
  ]
})
export class AppModule {
}
