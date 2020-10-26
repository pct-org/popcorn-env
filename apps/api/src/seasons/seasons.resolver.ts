import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Season, Episode } from '@pct-org/mongo-models'
import { Inject } from '@nestjs/common'

import { EpisodesService } from '../episodes/episodes.service'

@Resolver(of => Season)
export class SeasonsResolver {

  @Inject()
  private readonly episodesService: EpisodesService

  @ResolveField(type => [Episode], { description: 'Get all episodes for an season.' })
  public episodes(@Parent() season: Season): Promise<Episode[]> {
    // If we already have episodes then just get the full ones based on id
    if (season.episodes) {
      return this.episodesService.findAllWithIDS(
        season.episodes.map(({ _id }) => _id)
      )
    }

    return this.episodesService.findAllForSeason(season.showImdbId, season.number)
  }

}
