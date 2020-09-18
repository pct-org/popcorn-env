import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Season, Episode } from '@pct-org/mongo-models'

import { EpisodesService } from '../episodes/episodes.service'

@Resolver(of => Season)
export class SeasonsResolver {

  constructor(
    private readonly episodesService: EpisodesService
  ) {}

  @ResolveField(type => [Episode])
  episodes(@Parent() season: Season): Promise<Episode[]> {
    // If we already have episodes then just get the full ones based on id
    if (season.episodes) {
      return this.episodesService.findAllWithIDS(
        season.episodes.map(({ _id }) => _id)
      )
    }

    return this.episodesService.findAllForSeason(season.showImdbId, season.number)
  }

}
