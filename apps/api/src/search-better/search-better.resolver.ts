import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Movie, Episode, Download } from '@pct-org/mongo-models'

import { EpisodesService } from '../episodes/episodes.service'
import { MoviesService } from '../movies/movies.service'
import { SearchService } from '../shared/search/search.service'
import { ShowsService } from '../shows/shows.service'

@Resolver(of => Episode || Movie)
export class SearchBetterResolver {

  constructor(
    private readonly moviesService: MoviesService,
    private readonly episodesService: EpisodesService,
    private readonly showsService: ShowsService,
    private readonly searchService: SearchService
  ) {}

  @Mutation(returns => Episode, { description: 'Search for better qualities.' })
  async getBetterQualitiesForEpisode(@Args('_id') _id: string): Promise<Episode> {
    const episode = await this.episodesService.findOne(_id)

    // Set the show so we can properly build the search query
    episode.show = await this.showsService.findOne(episode.showImdbId)

    // Add the searched torrents
    episode.searchedTorrents = await this.searchService.searchEpisode(episode)

    // Update in database
    return await this.episodesService.updateOne(episode)
  }

  @Mutation(type => Movie, { description: 'Search for better qualities.' })
  async getBetterQualitiesForMovie(@Args('_id') _id: string): Promise<Movie> {
    const movie = await this.moviesService.findOne(_id)

    // Add the searched torrents
    movie.searchedTorrents = await this.searchService.searchMovie(movie)

    // Update in database
    return await this.moviesService.updateOne(movie)
  }

}
