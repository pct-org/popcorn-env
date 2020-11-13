import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Movie, MoviesService } from '@pct-org/types/movie'
import { ShowsService } from '@pct-org/types/show'
import { Episode, EpisodesService } from '@pct-org/types/episode'

import { SearchService } from '../shared/search/search.service'

@Resolver(of => Episode || Movie)
export class SearchBetterResolver {

  @Inject()
  private readonly moviesService: MoviesService

  @Inject()
  private readonly episodesService: EpisodesService

  @Inject()
  private readonly showsService: ShowsService

  @Inject()
  private readonly searchService: SearchService

  @Mutation(returns => Episode, { description: 'Search for better qualities.' })
  public async getBetterQualitiesForEpisode(@Args('_id') _id: string): Promise<Episode> {
    const episode = await this.episodesService.findOne(_id)

    // Set the show so we can properly build the search query
    episode.show = await this.showsService.findOne(episode.showImdbId)

    // Add the searched torrents
    episode.searchedTorrents = await this.searchService.searchEpisode(episode)

    // Update in database
    return await this.episodesService.updateOne(episode)
  }

  @Mutation(type => Movie, { description: 'Search for better qualities.' })
  public async getBetterQualitiesForMovie(@Args('_id') _id: string): Promise<Movie> {
    const movie = await this.moviesService.findOne(_id)

    // Add the searched torrents
    movie.searchedTorrents = await this.searchService.searchMovie(movie)

    // Update in database
    return await this.moviesService.updateOne(movie)
  }

}
