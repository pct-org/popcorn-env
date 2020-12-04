import { Inject, Injectable } from '@nestjs/common'
import { EpisodesService, Episode } from '@pct-org/types/episode'
import { MoviesService, Movie } from '@pct-org/types/movie'

@Injectable()
export class WatchedService {

  @Inject()
  private readonly moviesService: MoviesService

  @Inject()
  private readonly episodesService: EpisodesService

  public markMovie(_id: string, watched: boolean): Promise<Movie> {
    return this.moviesService.updateOne({
      _id,
      watched: {
        complete: watched,
        progress: watched ? 100 : 0
      }
    })
  }

  public markEpisode(_id: string, watched: boolean): Promise<Episode> {
    return this.episodesService.updateOne({
      _id,
      watched: {
        complete: watched,
        progress: watched ? 100 : 0
      }
    })
  }

}
